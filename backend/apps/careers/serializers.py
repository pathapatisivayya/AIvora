from rest_framework import serializers

from .models import JobApplication, JobPosting


class JobPostingSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobPosting
        fields = (
            "id",
            "title",
            "slug",
            "department",
            "location",
            "employment_type",
            "description",
            "requirements",
            "is_open",
            "posted_at",
        )
        extra_kwargs = {
            "slug": {"required": False, "allow_blank": True},
        }


class JobApplicationCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobApplication
        fields = ("full_name", "email", "phone", "linkedin_url", "cover_letter", "resume_url", "job")


class JobApplicationReadSerializer(serializers.ModelSerializer):
    job_title = serializers.CharField(source="job.title", read_only=True)

    class Meta:
        model = JobApplication
        fields = (
            "id",
            "job",
            "job_title",
            "full_name",
            "email",
            "phone",
            "linkedin_url",
            "cover_letter",
            "resume_url",
            "created_at",
        )
