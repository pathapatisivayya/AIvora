from rest_framework import generics
from rest_framework.permissions import AllowAny, IsAdminUser

from .models import JobApplication, JobPosting
from .serializers import (
    JobApplicationCreateSerializer,
    JobApplicationReadSerializer,
    JobPostingSerializer,
)


class JobListView(generics.ListAPIView):
    queryset = JobPosting.objects.filter(is_open=True)
    serializer_class = JobPostingSerializer
    permission_classes = [AllowAny]


class JobDetailView(generics.RetrieveAPIView):
    queryset = JobPosting.objects.filter(is_open=True)
    serializer_class = JobPostingSerializer
    lookup_field = "slug"
    permission_classes = [AllowAny]


class JobApplicationCreateView(generics.CreateAPIView):
    queryset = JobApplication.objects.all()
    serializer_class = JobApplicationCreateSerializer
    permission_classes = [AllowAny]


class JobAdminListCreateView(generics.ListCreateAPIView):
    queryset = JobPosting.objects.all()
    serializer_class = JobPostingSerializer
    permission_classes = [IsAdminUser]


class JobAdminDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = JobPosting.objects.all()
    serializer_class = JobPostingSerializer
    permission_classes = [IsAdminUser]


class ApplicationAdminListView(generics.ListAPIView):
    queryset = JobApplication.objects.select_related("job")
    serializer_class = JobApplicationReadSerializer
    permission_classes = [IsAdminUser]
