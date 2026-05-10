from django.shortcuts import get_object_or_404, render
from django.http import JsonResponse
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.conf import settings
from django.utils.timezone import now, timedelta
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes

# Restframework
from rest_framework import status
from rest_framework.decorators import APIView, permission_classes
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import generics
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.pagination import PageNumberPagination


from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from datetime import datetime

# Others
import json
import random
import secrets
from typing import Any, cast

# Custom Imports
from api import serializer as api_serializer
from api import models as api_models
from api.models import Feedback
from api.serializer import FeedbackSerializer

class PostPagination(PageNumberPagination):
    page_size = 6
    page_size_query_param = 'page_size'
    max_page_size = 50

class DashboardPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 50


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = api_serializer.MyTokenObtainPairSerializer         # Here, it specifies the serializer class to be used with this view.

class RegisterView(generics.CreateAPIView):
    queryset = api_models.User.objects.all()                # It sets the queryset for this view to retrieve all User objects
    permission_classes = (AllowAny,)                        # It specifies that the view allows any user (no authentication required).
    serializer_class = api_serializer.RegisterSerializer    # It sets the serializer class to be used with this view.


class ProfileView(generics.RetrieveUpdateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = api_serializer.ProfileSerializer

    def get_object(self) -> Any:
        user = self.request.user
        return get_object_or_404(api_models.Profile, user=user)


class AuthorProfileView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, user_id):
        try:
            user = api_models.User.objects.get(id=user_id)
            profile = api_models.Profile.objects.get(user=user)
            serializer = api_serializer.ProfileSerializer(profile, context={'request': request})
            return Response(serializer.data)
        except api_models.User.DoesNotExist:
            return Response({"message": "User not found"}, status=404)
        except api_models.Profile.DoesNotExist:
            return Response({"message": "Profile not found"}, status=404)
    

def generate_numeric_otp(length=6):
    otp = ''.join([str(secrets.randbelow(10)) for _ in range(length)])
    return otp


# --------------------------
# Password Verifier
# --------------------------
class PasswordEmailVerify(APIView):
    permission_classes = (AllowAny,)

    def post(self, request, *args, **kwargs):

        # GET USER BY EMAIL
        email = request.data.get('email')

        try:
            user = api_models.User.objects.get(email=email)
        except api_models.User.DoesNotExist:
            return Response({"message": "User not found"}, status=404)

        # GENERATE OTP + EXPIRY
        user.otp = generate_numeric_otp()
        user.otp_expiry = now() + timedelta(minutes=10)  # OTP valid for 10 mins

        # GENERATE RESET TOKEN (JWT)
        refresh = RefreshToken.for_user(user)
        reset_token = str(refresh.access_token)

        user.reset_token = reset_token
        user.save()

        # CREATE RESET LINK
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        link = f"http://localhost:5173/create-password/?otp={user.otp}&uid={uid}&token={reset_token}"

        merge_data = {
            'link': link,
            'username': user.username,
        }

        # SEND EMAIL
        subject = "Password Reset Request"
        text_body = render_to_string("email/password_reset.txt", merge_data)
        html_body = render_to_string("email/password_reset.html", merge_data)

        msg = EmailMultiAlternatives(
            subject=subject,
            from_email=settings.FROM_EMAIL,
            to=[user.email],
            body=text_body
        )
        msg.attach_alternative(html_body, "text/html")
        msg.send()

        return Response({"message": "Password reset email sent"}, status=200)


# --------------------------
# Password Change View
# --------------------------
class PasswordChangeView(APIView):
    permission_classes = (AllowAny,)

    def post(self, request, *args, **kwargs):

        # ================================
        # EXTRACT DATA
        # ================================
        otp = request.data.get('otp')
        uid = request.data.get('uid')
        password = request.data.get('password')
        token = request.data.get('token')

        # ================================
        # VALIDATE USER
        # ================================
        try:
            user = api_models.User.objects.get(id=uid, otp=otp)
        except api_models.User.DoesNotExist:
            return Response({"message": "Invalid OTP or user"}, status=400)

        # ================================
        # CHECK OTP EXPIRY
        # ================================
        if not user.otp_expiry or user.otp_expiry < now():
            return Response({"message": "OTP expired"}, status=400)

        # ================================
        # VALIDATE RESET TOKEN
        # ================================
        if user.reset_token != token:
            return Response({"message": "Invalid reset token"}, status=400)

        # ================================
        # VALIDATE PASSWORD (BASIC)
        # ================================
        if len(password) < 6:
            return Response({"message": "Password too short"}, status=400)

        # ================================
        # SET NEW PASSWORD
        # ================================
        user.set_password(password)

        # Clear sensitive fields
        user.otp = ""
        user.otp_expiry = None
        user.reset_token = ""
        user.save()

        return Response({"message": "Password changed successfully"}, status=200)



######################################## POST APIs ########################################
# --------------------------
# Post Category APIs 
# --------------------------
class CategoryListAPIView(generics.ListAPIView):
    serializer_class = api_serializer.CategorySerializer
    permission_classes = (AllowAny,)

    def get_queryset(self) -> Any:
        return api_models.Category.objects.all()
    

class PostCategoryListAPIView(generics.ListAPIView):
    serializer_class = api_serializer.PostSerializer
    permission_classes = [AllowAny]
    pagination_class = PostPagination

    def get_queryset(self) -> Any:
        category_slug = self.kwargs['category_slug'] 
        category = api_models.Category.objects.get(slug=category_slug)
        return api_models.Post.objects.filter(category=category, status="Active")


# --------------------------
# Post List APIs 
# --------------------------
class PostListAPIView(generics.ListAPIView):
    serializer_class = api_serializer.PostSerializer
    permission_classes = (AllowAny,)
    pagination_class = PostPagination

    def get_queryset(self) -> Any:
        return api_models.Post.objects.filter(status="Active")
    

class PostDetailAPIView(generics.RetrieveAPIView):
    serializer_class = api_serializer.PostSerializer
    permission_classes = (AllowAny,)

    def get_object(self) -> Any:
        slug = self.kwargs['slug']
        post = get_object_or_404(api_models.Post, slug=slug, status="Active")
        post.views += 1
        post.save(update_fields=["views"])
        return post
    

# --------------------------
# Post Likes APIs 
# --------------------------
class LikePostAPIView(APIView):
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'post_id': openapi.Schema(type=openapi.TYPE_STRING),
            },
        ),
    )

    def post(self, request):
        post_id = request.data.get('post_id')
        
        if not post_id:
            return Response({"message": "post_id is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            post = api_models.Post.objects.get(id=post_id)
        except api_models.Post.DoesNotExist:
            return Response({"message": "Post not found"}, status=status.HTTP_404_NOT_FOUND)

        user = request.user

        if user in post.Likes.all():
            post.Likes.remove(user)
            return Response({"message": "Post Disliked"}, status=status.HTTP_200_OK)
        else:
            post.Likes.add(user)
            
            if post.user != user:
                api_models.Notification.objects.create(
                    user=post.user,
                    post=post,
                    type="Like",
                )
            return Response({"message": "Post Liked"}, status=status.HTTP_201_CREATED)
        

# --------------------------
# Post Comments APIs 
# --------------------------
class PostCommentAPIView(APIView):
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'post_id': openapi.Schema(type=openapi.TYPE_INTEGER),
                'comment': openapi.Schema(type=openapi.TYPE_STRING),
            },
        ),
    )
    def post(self, request):
        post_id = request.data.get('post_id')
        comment_text = request.data.get('comment')

        if not post_id or not comment_text:
            return Response({"message": "post_id and comment are required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            post = api_models.Post.objects.get(id=post_id)
        except api_models.Post.DoesNotExist:
            return Response({"message": "Post not found"}, status=status.HTTP_404_NOT_FOUND)

        api_models.Comment.objects.create(
            post=post,
            name=request.user.profile.full_name if hasattr(request.user, 'profile') else request.user.username,
            email=request.user.email,
            comment=comment_text,
        )

        if post.user != request.user:
            api_models.Notification.objects.create(
                user=post.user,
                post=post,
                type="Comment",
            )

        return Response({"message": "Comment Posted"}, status=status.HTTP_201_CREATED)
 

# --------------------------
# Post Bookmark APIs 
# --------------------------
class BookmarkPostAPIView(APIView):
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'post_id': openapi.Schema(type=openapi.TYPE_STRING),
            },
        ),
    )
    
    def post(self, request):
        post_id = request.data.get('post_id')
        
        if not post_id:
            return Response({"message": "post_id is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            post = api_models.Post.objects.get(id=post_id)
        except api_models.Post.DoesNotExist:
            return Response({"message": "Post not found"}, status=status.HTTP_404_NOT_FOUND)

        user = request.user
        
        bookmark, created = api_models.Bookmark.objects.get_or_create(post=post, user=user)
        
        if not created:
            bookmark.delete()
            return Response({"message": "Post Un-Bookmarked"}, status=status.HTTP_200_OK)
        
        if post.user != user:
            api_models.Notification.objects.create(
                user=post.user,
                post=post,
                type="Bookmark",
            )
        return Response({"message": "Post Bookmarked"}, status=status.HTTP_201_CREATED)




######################################## POST APIs ########################################
# --------------------------
# Dashboard Stats APIs 
# --------------------------
class DashboardStats(generics.ListAPIView):
    serializer_class = api_serializer.AuthorStats
    permission_classes = [IsAuthenticated]

    def get_queryset(self) -> Any:
        user = self.request.user
        posts = api_models.Post.objects.filter(user=user)
        views = sum(post.views for post in posts)
        likes = sum(post.Likes.count() for post in posts)
        bookmarks = api_models.Bookmark.objects.filter(post__user=user).count()

        return [{
            "views": views,
            "posts": posts.count(),
            "likes": likes,
            "bookmarks": bookmarks,
        }]

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)

        return Response(serializer.data)


# --------------------------
# Dashboard Post List APIs 
# --------------------------
class DashboardPostList(generics.ListAPIView):
    serializer_class = api_serializer.PostSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = DashboardPagination

    def get_queryset(self) -> Any:
        user = self.request.user
        return api_models.Post.objects.filter(user=user).order_by("-id")


# --------------------------
# Dashboard Comment List APIs 
# --------------------------
class DashboardCommentList(generics.ListAPIView):
    serializer_class = api_serializer.CommentSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = DashboardPagination

    def get_queryset(self) -> Any:
        user = self.request.user
        return api_models.Comment.objects.filter(post__user=user)


# --------------------------
# Dashboard Notification List APIs 
# --------------------------
class DashboardNotificationList(generics.ListAPIView):
    serializer_class = api_serializer.NotificationSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = DashboardPagination

    def get_queryset(self) -> Any:
        user = self.request.user
        queryset = api_models.Notification.objects.filter(user=user)

        if self.request.query_params.get("seen") != "all":
            queryset = queryset.filter(seen=False)

        return queryset


# --------------------------
# Dashboard MarkedNotification List APIs 
# --------------------------
class DashboardMarkNotificationList(APIView):
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'noti_id': openapi.Schema(type=openapi.TYPE_INTEGER),
            },
        ),
    )

    def post(self, request):
        noti_id = request.data.get('noti_id')
        
        if not noti_id:
            return Response({"message": "noti_id is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            noti = api_models.Notification.objects.get(id=noti_id, user=request.user)
        except api_models.Notification.DoesNotExist:
            return Response({"message": "Notification not found"}, status=status.HTTP_404_NOT_FOUND)

        noti.seen = True
        noti.save()

        return Response({"message": "Notification Marked as Seen"}, status=status.HTTP_200_OK)


# --------------------------
# Dashboard Reply Comment List APIs 
# --------------------------
class DashboardReplyCommentAPIView(APIView):
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'comment_id': openapi.Schema(type=openapi.TYPE_INTEGER),
                'reply': openapi.Schema(type=openapi.TYPE_STRING),
            },
        ),
    )

    def post(self, request):
        comment_id = request.data.get('comment_id')
        reply = request.data.get('reply')
        
        if not comment_id or not reply:
            return Response({"message": "comment_id and reply are required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            comment = api_models.Comment.objects.get(id=comment_id, post__user=request.user)
        except api_models.Comment.DoesNotExist:
            return Response({"message": "Comment not found"}, status=status.HTTP_404_NOT_FOUND)

        comment.reply = reply
        comment.save()

        return Response({"message": "Comment Response Sent"}, status=status.HTTP_201_CREATED)
    

# --------------------------
# Dashboard Post Creation APIs 
# --------------------------
class DashboardPostCreateAPIView(generics.CreateAPIView):
    serializer_class = api_serializer.PostSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        user = request.user
        title = request.data.get('title')
        image = request.data.get('image')
        description = request.data.get('description')
        tags = request.data.get('tags')
        category_id = request.data.get('category')
        post_status = request.data.get('post_status')

        if not title or not description:
            return Response({"message": "Title and description are required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            category = api_models.Category.objects.get(id=category_id)
        except api_models.Category.DoesNotExist:
            return Response({"message": "Category not found"}, status=status.HTTP_404_NOT_FOUND)

        profile, _ = api_models.Profile.objects.get_or_create(user=user)
        
        post = api_models.Post.objects.create(
            user=user,
            profile=profile,
            title=title,
            image=image,
            description=description,
            tags=tags,
            category=category,
            status=post_status
        )

        return Response({"message": "Post Created Successfully", "post_id": post.id}, status=status.HTTP_201_CREATED)
    

# --------------------------
# Dashboard Post Editing APIs 
# --------------------------
class DashboardUpdatePostAPIView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = api_serializer.PostSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self) -> Any:
        user = self.request.user
        post_id = self.kwargs.get('post_id')
        return get_object_or_404(api_models.Post, id=post_id, user=user)

    def update(self, request, *args, **kwargs):
        post_instance = self.get_object()

        title = request.data.get('title')
        image = request.data.get('image')
        description = request.data.get('description')
        tags = request.data.get('tags')
        category_id = request.data.get('category')
        post_status = request.data.get('post_status')

        if not title or not description:
            return Response({"message": "Title and description are required"}, status=status.HTTP_400_BAD_REQUEST)

        category = get_object_or_404(api_models.Category, id=category_id)

        post_instance.title = title
        if image and image != "undefined":
            post_instance.image = image
        post_instance.description = description
        post_instance.tags = tags
        post_instance.category = category
        post_instance.status = post_status
        post_instance.save()

        return Response({"message": "Post Updated Successfully"}, status=status.HTTP_200_OK)



# --------------------------
# Feedback APIs 
# --------------------------
class FeedbackAPIView(generics.CreateAPIView):
    queryset = Feedback.objects.all()
    serializer_class = FeedbackSerializer
    permission_classes = [AllowAny]
