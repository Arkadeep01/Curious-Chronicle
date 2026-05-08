from django.core.management.base import BaseCommand
from faker import Faker
import random

from api.models import User, Profile, Category, Post

fake = Faker()


class Command(BaseCommand):
    help = "Seed database with 30 blog posts"

    def handle(self, *args, **kwargs):

        # ----------------------------
        # Categories
        # ----------------------------
        categories = [
            "Technology",
            "Programming",
            "AI",
            "Travel",
            "Health",
            "Lifestyle",
            "Business",
            "Education",
        ]

        category_objs = []

        for cat in categories:
            category, created = Category.objects.get_or_create(
                title=cat
            )
            category_objs.append(category)

        self.stdout.write(
            self.style.SUCCESS("Categories created")
        )

        # ----------------------------
        # User
        # ----------------------------
        user, created = User.objects.get_or_create(
            email="admin@example.com",
            defaults={
                "username": "admin",
                "full_name": "Admin User",
            }
        )

        if created:
            user.set_password("admin123")
            user.save()

        profile = Profile.objects.get(user=user)

        self.stdout.write(
            self.style.SUCCESS("User created")
        )

        # ----------------------------
        # Default Images
        # ----------------------------
        images = [
            "posts/post1.jpg",
            "posts/post2.jpg",
            "posts/post3.jpg",
            "posts/post4.jpg",
            "posts/post5.jpg",
        ]

        # ----------------------------
        # Create Posts
        # ----------------------------
        for i in range(30):

            title = fake.sentence(nb_words=6)

            image_url = f"https://source.unsplash.com/1600x900/?blog,{random.choice([
                'technology',
                'coding',
                'ai',
                'travel',
                'business',
                'startup',
                'nature',
                'lifestyle'
            ])}"

            Post.objects.create(
                user=user,
                profile=profile,
                category=random.choice(category_objs),

                title=title,

                description=f"""
                <h2>{fake.sentence()}</h2>

                <p>{fake.paragraph(nb_sentences=8)}</p>

                <p>{fake.paragraph(nb_sentences=6)}</p>

                <blockquote>
                    {fake.sentence()}
                </blockquote>

                <p>{fake.paragraph(nb_sentences=10)}</p>
                """,

                image=image_url,

                status="Active",

                tags=", ".join(fake.words(nb=5)),

                views=random.randint(0, 5000),
            )