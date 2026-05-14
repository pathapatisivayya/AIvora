from rest_framework import generics
from rest_framework.permissions import AllowAny

from .models import Client, Testimonial
from .serializers import ClientSerializer, TestimonialSerializer


class ClientListView(generics.ListAPIView):
    queryset = Client.objects.filter(is_active=True)
    serializer_class = ClientSerializer
    permission_classes = [AllowAny]


class TestimonialListView(generics.ListAPIView):
    queryset = Testimonial.objects.filter(is_featured=True)
    serializer_class = TestimonialSerializer
    permission_classes = [AllowAny]
