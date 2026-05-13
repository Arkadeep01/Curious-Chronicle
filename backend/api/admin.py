from django.contrib import admin
from api import models as api_models

class UserAdmin(admin.ModelAdmin):
    search_fields  = ['full_name', 'username', 'email']
    list_display  = ['username', 'email']

class ProfileAdmin(admin.ModelAdmin):
    search_fields = ['user__username', 'user__email']
    list_display = ['thumbnail', 'get_username', 'get_email', 'full_name']

    @admin.display(description="Username")
    def get_username(self, obj):
        return obj.user.username

    @admin.display(description="Email")
    def get_email(self, obj):
        return obj.user.email
    
class CategoryAdmin(admin.ModelAdmin):
    list_display = ["title"]

class PostAdmin(admin.ModelAdmin):
    list_display = ["title", "user", "category", "view_count"]

    def view_count(self, obj):
        return obj.views

class CommentAdmin(admin.ModelAdmin):
    list_display = ["post","name","email","comment"]

class BookmarkAdmin(admin.ModelAdmin):
    list_display = ["user","post"]

class NotificationAdmin(admin.ModelAdmin):
    list_display = ["user","post","type","seen",]


admin.site.register(api_models.User, UserAdmin)
admin.site.register(api_models.Profile, ProfileAdmin)
admin.site.register(api_models.Category, CategoryAdmin)
admin.site.register(api_models.Post, PostAdmin)
admin.site.register(api_models.Comment, CommentAdmin)
admin.site.register(api_models.Notification, NotificationAdmin)
admin.site.register(api_models.Bookmark, BookmarkAdmin)