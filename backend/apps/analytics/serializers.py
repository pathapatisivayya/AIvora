from rest_framework import serializers

from .models import PageEvent


class PageEventCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = PageEvent
        fields = ("path", "referrer", "session_key")


class PageEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = PageEvent
        fields = ("id", "path", "referrer", "created_at")
