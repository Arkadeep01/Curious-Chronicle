from django.db import models
from django.contrib.auth.models import AbstractUser
from django.db.models.signals import post_save
from django.utils.safestring import mark_safe
from django.utils.text import slugify
from shortuuid.django_fields import ShortUUIDField
import shortuuid


# ----------------------------
# User Model
# ----------------------------
class User(AbstractUser):
  username = models.CharField(unique=True, max_length=255)
  email = models.EmailField(unique=True)
  full_name = models.CharField(max_length=100, null=True)
  # otp = models.CharField(max_length=100, null=True, blank=True)
  # reset_token = models.CharField(max_length=255, null=True, blank=True)
  
  USERNAME_FIELD = 'email'
  REQUIRED_FIELDS = ['username']

  def __str__(self) -> str:
    return f"{self.username} ({self.email})"
  
  def save(self, *args, **kwargs):
    email_username = self.email.split('@')[0] if self.email else ""

    if not self.full_name:
      if self.username:
        self.full_name = self.username
      else:
        self.full_name = email_username
    if not self.username:
      self.username = email_username

    super(User, self).save(*args, **kwargs)



# ----------------------------
# Profile Model
# ----------------------------
class Profile(models.Model):
  user = models.OneToOneField(User, on_delete=models.CASCADE)
  image = models.ImageField(upload_to="image", default="default/default-user.jpg", null=True, blank=True)
  full_name = models.CharField(max_length=100, null=True, blank=True)
  bio = models.TextField(null=True, blank=True)
  about = models.TextField(null=True, blank=True)
  author = models.BooleanField(default=False)
  country = models.CharField(max_length=100, null=True, blank=True)
  facebook = models.CharField(max_length=100, null=True, blank=True)
  twitter = models.CharField(max_length=100, null=True, blank=True)
  date = models.DateTimeField(auto_now_add=True)

  def __str__(self) -> str:
    return f"{self.user.username} ({self.user.email})"
  
  def save(self, *args, **kwargs):
    if self.full_name == "" or self.full_name == None:
      self.full_name = self.user.full_name

    super(Profile, self).save(*args, **kwargs)

  def thumbnail(self):
    return mark_safe('<img src="/media/%s" width="50" height="50" object-fit:"cover" style="border-radius: 30px; object-fit: cover;" />' % (self.image))


def create_user_profile(sender, instance, created, **kwargs):
  if created:
    Profile.objects.create(user=instance)

def save_user_profile(sender, instance, **kwargs):
  Profile.objects.get_or_create(user=instance)

post_save.connect(create_user_profile, sender=User)
post_save.connect(save_user_profile, sender=User)



# ----------------------------
# Category Model
# ----------------------------
class Category(models.Model):
  title = models.CharField(max_length=100)
  image = models.ImageField(upload_to="image", null=True, blank=True)
  slug = models.SlugField(unique=True, null=True, blank=True)

  def __str__(self) -> str:
    return self.title
  
  class Meta:
    verbose_name_plural = "Categories"

  def save(self, *args, **kwargs):
    if self.slug == "" or self.slug == None:
      self.slug = slugify(self.title)

    super(Category, self).save(*args, **kwargs)

  def post_count(self):
    return Post.objects.filter(Category=self).count()



# ----------------------------
# Post Model
# ----------------------------
class Post(models.Model):

  STATUS = (
    ("Active", "Active"),
    ("Draft", "Draft"),
    ("Disabled", "Disabled"),
  )

  user = models.ForeignKey(User, on_delete=models.CASCADE)
  profile = models.ForeignKey(Profile, on_delete=models.CASCADE, null=True, blank=True)
  category = models.ForeignKey(Category, on_delete=models.CASCADE, null=True, blank=True, related_name="posts")  
  title = models.CharField(max_length=100)
  description =models.TextField(null=True, blank=True)
  image = models.ImageField(upload_to="image", null=True, blank=True)
  status = models.CharField(choices=STATUS, max_length=100, default="Active")
  tags = models.CharField(max_length=255, null=True, blank=True)
  views = models.IntegerField(default=0)
  Likes = models.ManyToManyField(User, blank=True, related_name="Likes_User")
  slug = models.SlugField(unique=True, null=True, blank=True)  
  date = models.DateTimeField(auto_now_add=True)

  def __str__(self) -> str:
    return self.title
  
  class Meta:
    ordering = ["-date"]
    verbose_name_plural = "Post"

  def save(self, *args, **kwargs):
    if self.slug == "" or self.slug == None:
      self.slug = slugify(self.title) + "-" + shortuuid.uuid()[:4]

    super(Post, self).save(*args, **kwargs)



# ----------------------------
# Comment Model
# ----------------------------
class Comment(models.Model):
  post = models.ForeignKey(Post, on_delete=models.CASCADE)
  name = models.CharField(max_length=100)
  email = models.CharField(max_length=100)
  comment =models.TextField(null=True, blank=True)
  reply =models.TextField(null=True, blank=True)
  date = models.DateTimeField(auto_now_add=True)

  def __str__(self) -> str:
    return self.post.title
  
  class Meta:
    ordering = ["-date"]
    verbose_name_plural = "Comment"



# ----------------------------
# Bookmark Model
# ----------------------------
class Bookmark(models.Model):
  user = models.ForeignKey(User, on_delete=models.CASCADE)
  post = models.ForeignKey(Post, on_delete=models.CASCADE)
  date = models.DateTimeField(auto_now_add=True)

  def __str__(self) -> str:
    return self.post.title
  
  class Meta:
    ordering = ["-date"]
    verbose_name_plural = "Bookmarks"

  

# ----------------------------
# Notification Model
# ----------------------------
class Notification(models.Model):
  NOTI_TYPE = (
    ("Like", "Like"),
    ("Comment", "Comment"),
    ("Bookmarks", "Bookmarks"),
  )
  user = models.ForeignKey(User, on_delete=models.CASCADE)
  post = models.ForeignKey(Post, on_delete=models.CASCADE)
  type = models.CharField(choices=NOTI_TYPE, max_length=100)
  seen = models.BooleanField(default=False)
  date = models.DateTimeField(auto_now_add=True)

  def __str__(self):
    if self.post:
      return f"{self.post.title} - {self.type}"
    else:
      return "Notification"
  
  class Meta:
    ordering = ["-date"]
    verbose_name_plural = "Notifications"
