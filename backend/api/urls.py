from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from api import views as api_views

urlpatterns = [
  path('user/token/', api_views.MyTokenObtainPairView.as_view()),
  path('user/token/refresh/', TokenRefreshView.as_view()),
  path('user/register/', api_views.RegisterView.as_view()),
  path('user/profile/', api_views.ProfileView.as_view()),
  path('user/profile/<int:user_id>/', api_views.AuthorProfileView.as_view()),
  path('user/password-reset/', api_views.PasswordEmailVerify.as_view(), name='password_reset'),
  path('user/password-change/', api_views.PasswordChangeView.as_view(), name='password_change'),

  # POST Endpoints
  path('post/category/list/', api_views.CategoryListAPIView.as_view()),
  path('post/category/posts/<category_slug>/', api_views.PostCategoryListAPIView.as_view()),
  path('post/lists/', api_views.PostListAPIView.as_view()),
  path('post/details/<slug>/', api_views.PostDetailAPIView.as_view()),
  path('post/likes-post/', api_views.LikePostAPIView.as_view()),
  path('post/comments/', api_views.PostCommentAPIView.as_view()),
  path('post/bookmarks/', api_views.BookmarkPostAPIView.as_view()),


  # Dashboard Endpoints
  path('author/dashboard/stats/', api_views.DashboardStats.as_view()),
  path('author/dashboard/post-list/', api_views.DashboardPostList.as_view()),
  path('author/dashboard/comment-list/', api_views.DashboardCommentList.as_view()),
  path('author/dashboard/noti-list/', api_views.DashboardNotificationList.as_view()),
  path('author/dashboard/noti-mark-seen/', api_views.DashboardMarkNotificationList.as_view()),
  path('author/dashboard/reply-comment/', api_views.DashboardReplyCommentAPIView.as_view()),
  path('author/dashboard/post-create/', api_views.DashboardPostCreateAPIView.as_view()),
  path('author/dashboard/post-detail/<int:post_id>/', api_views.DashboardUpdatePostAPIView.as_view()),

  # Additional for Feedback
  path('feedback/', api_views.FeedbackAPIView.as_view()),
]
