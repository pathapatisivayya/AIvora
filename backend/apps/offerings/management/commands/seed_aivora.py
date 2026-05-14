from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand
from django.utils import timezone

from apps.blog.models import BlogPost
from apps.careers.models import JobPosting
from apps.offerings.models import Service, Solution
from apps.portfolio.models import Project
from apps.testimonials.models import Client, Testimonial


class Command(BaseCommand):
    help = "Seed demo content for Aivora Solutions marketing site."

    def handle(self, *args, **options):
        User = get_user_model()

        services_data = [
            ("AI Solutions", "ai-solutions", "Custom ML pipelines, automation, and intelligent assistants."),
            ("School Management Systems", "school-management-systems", "ERP for academics, admissions, fees, and portals."),
            ("Hospital Software", "hospital-software", "Clinical workflows, billing, scheduling, and compliance-ready UX."),
            ("Church Websites", "church-websites", "Events, giving, sermons, and beautiful responsive layouts."),
            ("Government Portals", "government-portals", "Secure citizen services and operational dashboards."),
            ("Mobile App Development", "mobile-app-development", "Cross-platform apps with offline-first patterns."),
            ("Web Development", "web-development", "High-performance React frontends with Django APIs."),
            ("SaaS Platforms", "saas-platforms", "Multi-tenant billing, roles, and analytics."),
            ("Cloud Solutions", "cloud-solutions", "AWS-native architecture, CI/CD, and resilient deployments."),
        ]
        icons = ["Brain", "GraduationCap", "HeartPulse", "Church", "Landmark", "Smartphone", "Globe", "Layers", "Cloud"]
        for i, (title, slug, summary) in enumerate(services_data):
            Service.objects.update_or_create(
                slug=slug,
                defaults={
                    "title": title,
                    "summary": summary,
                    "description": f"{summary}\n\nWe scope integrations, SLAs, and rollout plans tailored to your teams.",
                    "icon": icons[i % len(icons)],
                    "order": i,
                    "is_featured": True,
                },
            )

        Solution.objects.update_or_create(
            slug="education-cloud",
            defaults={
                "title": "Education Cloud",
                "tagline": "Admissions to alumni on one spine.",
                "body": "Attendance, grading, fees, transport, and parent apps unified with analytics for leadership.",
                "highlights": ["Role-based portals", "Offline-first mobile", "Finance integrations"],
                "order": 1,
            },
        )
        Solution.objects.update_or_create(
            slug="health-command",
            defaults={
                "title": "Health Command",
                "tagline": "Clinical clarity without compromising compliance.",
                "body": "Scheduling, EMR workflows, billing hooks, and inventory tuned for hospital throughput.",
                "highlights": ["Audit trails", "HL7/FHIR paths", "Secure messaging"],
                "order": 2,
            },
        )

        projects = [
            ("school-erp", "School ERP", "school", "Unified academics and parent engagement."),
            ("hospital-management", "Hospital Management", "hospital", "Clinical workflows and billing."),
            ("ai-music-platform", "AI Music Platform", "ai", "Recommendation and creator tooling."),
            ("church-website", "Church Website", "church", "Streaming, events, and donations."),
            ("government-dashboard", "Government Dashboard", "government", "Operational KPIs and routing."),
        ]
        for order, (slug, title, cat, summary) in enumerate(projects):
            Project.objects.update_or_create(
                slug=slug,
                defaults={
                    "title": title,
                    "category": cat,
                    "summary": summary,
                    "description": "Architecture-first delivery with observability and UX polish.",
                    "stack": ["Django", "React", "PostgreSQL", "AWS"],
                    "featured": True,
                    "order": order,
                },
            )

        Client.objects.get_or_create(name="Northwind Schools", defaults={"order": 1})
        Client.objects.get_or_create(name="Harbor Health", defaults={"order": 2})

        Testimonial.objects.update_or_create(
            client_name="Priya N.",
            defaults={
                "role": "CTO",
                "company": "Regional Health Group",
                "quote": "Aivora shipped compliant workflows in weeks — UX and performance exceeded our board demo.",
                "rating": 5,
                "order": 1,
                "is_featured": True,
            },
        )

        JobPosting.objects.update_or_create(
            slug="senior-full-stack-engineer",
            defaults={
                "title": "Senior Full-Stack Engineer",
                "department": "Engineering",
                "location": "Remote",
                "employment_type": "full_time",
                "description": "Lead Django + React deliveries with strong DevOps instincts.",
                "requirements": "5+ years shipping web platforms; experience with DRF, PostgreSQL, AWS.",
                "is_open": True,
            },
        )

        staff = User.objects.filter(is_superuser=True).first()
        BlogPost.objects.update_or_create(
            slug="shipping-ai-features",
            defaults={
                "title": "Shipping AI features without breaking trust",
                "excerpt": "Patterns for observability and human-in-the-loop releases.",
                "body": "Start with evaluation harnesses, shadow traffic, and rollback-friendly deployments.",
                "published": True,
                "published_at": timezone.now(),
                "author": staff,
            },
        )

        self.stdout.write(self.style.SUCCESS("Aivora demo content seeded."))
