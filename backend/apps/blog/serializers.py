from rest_framework import serializers

from .models import BlogPost


class BlogPostSerializer(serializers.ModelSerializer):
    author_name = serializers.SerializerMethodField()

    class Meta:
        model = BlogPost
        fields = (
            "id",
            "author_name",
            "title",
            "slug",
            "excerpt",
            "body",
            "cover_image",
            "published",
            "published_at",
            "created_at",
            "updated_at",
        )

    def get_author_name(self, obj):
        if obj.author:
            return obj.author.get_full_name() or obj.author.username
        return "Aivora Team"
