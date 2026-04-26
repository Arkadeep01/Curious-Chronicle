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
from rest_framework.decorators import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import generics
from rest_framework.permissions import AllowAny
from rest_framework.decorators import api_view, permission_classes
from rest_framework_simplejwt.tokens import RefreshToken


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

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = api_serializer.MyTokenObtainPairSerializer         # Here, it specifies the serializer class to be used with this view.

class RegisterView(generics.CreateAPIView):
    queryset = api_models.User.objects.all()                # It sets the queryset for this view to retrieve all User objects
    permission_classes = (AllowAny,)                        # It specifies that the view allows any user (no authentication required).
    serializer_class = api_serializer.RegisterSerializer    # It sets the serializer class to be used with this view.


class ProfileView(generics.RetrieveUpdateAPIView):
    permission_classes = (AllowAny,)
    serializer_class = api_serializer.ProfileSerializer

    def get_object(self) -> Any:
        user_id = self.kwargs['user_id']
        user = get_object_or_404(api_models.User, id=user_id)
        return get_object_or_404(api_models.Profile, user=user)
    

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
    @swagger_auto_schema(
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'user_id': openapi.Schema(type=openapi.TYPE_INTEGER),
                'post_id': openapi.Schema(type=openapi.TYPE_STRING),
            },
        ),
    )

    def post(self, request):
        user_id = request.data['user_id']
        post_id = request.data['post_id']

        user = api_models.User.objects.get(id=user_id)
        post = api_models.Post.objects.get(id=post_id)

        if user in post.Likes.all():        # Check if post has already been liked by this user
            post.Likes.remove(user)         # If liked, unlike post
            return Response({"message": "Post Disliked"}, status=status.HTTP_200_OK)
        else:
            post.Likes.add(user)             # If post hasn't been liked, like the post by adding user to set of poeple who have liked the post
            
            # Create Notification for Author
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
    @swagger_auto_schema(
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'post_id': openapi.Schema(type=openapi.TYPE_INTEGER),
                'name': openapi.Schema(type=openapi.TYPE_STRING),
                'email': openapi.Schema(type=openapi.TYPE_STRING),
                'comment': openapi.Schema(type=openapi.TYPE_STRING),
            },
        ),
    )
    def post(self, request):
        # Get data from request.data (frontend)
        post_id = request.data['post_id']
        name = request.data['name']
        email = request.data['email']
        comment = request.data['comment']

        post = api_models.Post.objects.get(id=post_id)

        # Create Comment
        api_models.Comment.objects.create(
            post=post,
            name=name,
            email=email,
            comment=comment,
        )

        # Notification
        api_models.Notification.objects.create(
            user=post.user,
            post=post,
            type="Comment",
        )

        # Return response back to the frontend
        return Response({"message": "Commented Sent"}, status=status.HTTP_201_CREATED)
 

# --------------------------
# Post Bookmark APIs 
# --------------------------
class BookmarkPostAPIView(APIView):
    @swagger_auto_schema(
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'user_id': openapi.Schema(type=openapi.TYPE_INTEGER),
                'post_id': openapi.Schema(type=openapi.TYPE_STRING),
            },
        ),
    )
    
    def post(self, request):
        user_id = request.data['user_id']
        post_id = request.data['post_id']

        user = api_models.User.objects.get(id=user_id)
        post = api_models.Post.objects.get(id=post_id)

        bookmark = api_models.Bookmark.objects.filter(post=post, user=user).first()
        
        if bookmark:
            # Remove post from bookmark
            bookmark.delete()
            return Response({"message": "Post Un-Bookmarked"}, status=status.HTTP_200_OK)
        else:
            api_models.Bookmark.objects.create(
                user=user,
                post=post
            )

            # Notification
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
    permission_classes = (AllowAny,)

    def get_queryset(self) -> Any:
        user_id = self.kwargs['user_id']
        user = api_models.User.objects.get(id=user_id)
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

    # We grab all the query_set written in this block above
    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)

        return Response(serializer.data)


# --------------------------
# Dashboard Post List APIs 
# --------------------------
class DashboardPostList(generics.ListAPIView):
    serializer_class = api_serializer.PostSerializer
    permission_classes = (AllowAny,)

    def get_queryset(self) -> Any:
        user_id = self.kwargs['user_id']
        user = api_models.User.objects.get(id=user_id)

        return api_models.Post.objects.filter(user=user).order_by("-id")


# --------------------------
# Dashboard Comment List APIs 
# --------------------------
class DashboardCommentList(generics.ListAPIView):
    serializer_class = api_serializer.CommentSerializer
    permission_classes = (AllowAny,)

    def get_queryset(self) -> Any:
        user_id = self.kwargs['user_id']
        user = api_models.User.objects.get(id=user_id)
            
        return api_models.Comment.objects.filter(post__user=user)


# --------------------------
# Dashboard Notification List APIs 
# --------------------------
class DashboardNotificationList(generics.ListAPIView):
    serializer_class = api_serializer.NotificationSerializer
    permission_classes = (AllowAny,)

    def get_queryset(self) -> Any:
        user_id = self.kwargs['user_id']
        user = api_models.User.objects.get(id=user_id)

        return api_models.Notification.objects.filter(seen=False, user=user)


# --------------------------
# Dashboard MarkedNotification List APIs 
# --------------------------
class DashboardMarkNotificationList(APIView):
    @swagger_auto_schema(
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'noti_id': openapi.Schema(type=openapi.TYPE_INTEGER),
            },
        ),
    )

    def post(self, request):
        noti_id= request.data['noti_id']
        noti = api_models.Notification.objects.get(id=noti_id)

        noti.seen = True
        noti.save()

        return Response({"message": "Notification Marked as Seen"}, status=status.HTTP_200_OK)


# --------------------------
# Dashboard Reply Comment List APIs 
# --------------------------
class DashboardReplyCommentAPIView(APIView):
    @swagger_auto_schema(
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'noti_id': openapi.Schema(type=openapi.TYPE_INTEGER),
            },
        ),
    )

    def post(self, request):
        comment_id= request.data['comment_id']
        reply = request.data['reply']
        comment = api_models.Comment.objects.get(id=comment_id)
        comment.reply = reply
        comment.save()

        return Response({"message": "Comment Response Sent"}, status=status.HTTP_201_CREATED)
    

# --------------------------
# Dashboard Post Creation APIs 
# --------------------------
class DashboardPostCreateAPIView(generics.CreateAPIView):
    serializer_class = api_serializer.PostSerializer
    permission_classes = (AllowAny,)

    def create(self, request, *args, **kwargs):
        print(request.data)

        user_id= request.data.get('user_id')
        title= request.data.get('title')
        image= request.data.get('image')
        description= request.data.get('description')
        tags= request.data.get('tags')
        category_id= request.data.get('category')
        post_status= request.data.get('post_status')
        
        print(user_id)
        print(title)
        print(image)
        print(description)
        print(tags)
        print(category_id)
        print(post_status)

        user = api_models.User.objects.get(id=user_id)
        category = api_models.Category.objects.get(id=category_id)
        
        post = api_models.Post.objects.create(
            user=user,
            title=title,
            image=image,
            description=description,
            tags=tags,
            category=category,
            status=post_status
        )

        return Response({"message": "Post Created Successfully"}, status=status.HTTP_201_CREATED)
    

# --------------------------
# Dashboard Post Editing APIs 
# --------------------------
class DashboardUpdatePostAPIView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = api_serializer.PostSerializer
    permission_classes = (AllowAny,)

    def get_object(self) -> Any:
        user_id = self.kwargs['user_id']
        post_id = self.kwargs['post_id']
        user = get_object_or_404(api_models.User, id=user_id)
        return get_object_or_404(api_models.Post, id=post_id, user=user)

    def update(self, request, *args, **kwargs):
        post_instance = self.get_object()

        title = request.data.get('title')
        image = request.data.get('image')
        description = request.data.get('description')
        tags = request.data.get('tags')
        category_id = request.data.get('category')
        post_status = request.data.get('post_status')

        print(title)
        print(image)
        print(description)
        print(tags)
        print(category_id)
        print(post_status)

        category = get_object_or_404(api_models.Category, id=category_id)

        post_instance.title = title
        if image != "undefined":
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