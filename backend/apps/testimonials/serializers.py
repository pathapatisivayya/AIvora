from rest_framework import serializers

from .models import Client, Testimonial


class ClientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Client
        fields = ("id", "name", "logo_url", "website_url", "order", "is_active")


class TestimonialSerializer(serializers.ModelSerializer):
    class Meta:
        model = Testimonial
        fields = (
            "id",
            "client_name",
            "role",
            "company",
            "quote",
            "avatar_url",
            "rating",
            "order",
            "is_featured",
            "created_at",
        )
