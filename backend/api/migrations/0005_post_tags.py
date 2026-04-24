from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("api", "0004_post_likes_remove_post_views_post_views"),
    ]

    operations = [
        migrations.AddField(
            model_name="post",
            name="tags",
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
    ]
