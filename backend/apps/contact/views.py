from django.conf import settings
from rest_framework import generics, permissions, status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from .email_notifications import send_staff_inquiry_notification
from .models import Inquiry
from .serializers import InquiryCreateSerializer, InquirySerializer


class InquiryCreateView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = InquiryCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        inquiry = serializer.save()
        email_sent = send_staff_inquiry_notification(inquiry)
        payload = {"id": inquiry.id, "detail": "Thank you. We will respond shortly."}
        if settings.DEBUG:
            payload["email_notification_sent"] = email_sent
        return Response(payload, status=status.HTTP_201_CREATED)


class InquiryListView(generics.ListAPIView):
    queryset = Inquiry.objects.all()
    serializer_class = InquirySerializer
    permission_classes = [permissions.IsAdminUser]


class InquiryDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Inquiry.objects.all()
    serializer_class = InquirySerializer
    permission_classes = [permissions.IsAdminUser]


class SiteSettingsView(APIView):
    """Public marketing-related settings for frontend."""

    permission_classes = [AllowAny]

    def get(self, request):
        return Response(
            {
                "company_name": "Aivora Solutions",
                "tagline": "Building Smart Digital Solutions",
                "whatsapp_number": getattr(settings, "WHATSAPP_NUMBER", "") or "",
                "contact_email": getattr(settings, "CONTACT_EMAIL_TO", "") or "",
            }
        )
