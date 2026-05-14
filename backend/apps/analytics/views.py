from django.db.models import Count
from django.db.models.functions import TruncDate
from django.utils import timezone
from rest_framework import permissions, status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.contact.models import Inquiry

from .models import PageEvent
from .serializers import PageEventCreateSerializer


class TrackPageEventView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        ser = PageEventCreateSerializer(data=request.data)
        ser.is_valid(raise_exception=True)
        ua = request.META.get("HTTP_USER_AGENT", "")[:400]
        PageEvent.objects.create(
            **ser.validated_data,
            user_agent=ua,
        )
        return Response({"ok": True}, status=status.HTTP_201_CREATED)


class AnalyticsDashboardView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def get(self, request):
        since = timezone.now() - timezone.timedelta(days=30)
        views_qs = PageEvent.objects.filter(created_at__gte=since)
        total_views = views_qs.count()
        by_day = (
            views_qs.annotate(day=TruncDate("created_at"))
            .values("day")
            .annotate(c=Count("id"))
            .order_by("day")
        )
        inquiries = Inquiry.objects.filter(created_at__gte=since).count()
        top_paths = (
            views_qs.values("path").annotate(c=Count("id")).order_by("-c")[:10]
        )
        return Response(
            {
                "period_days": 30,
                "total_page_views": total_views,
                "total_inquiries": inquiries,
                "views_by_day": list(by_day),
                "top_paths": list(top_paths),
            }
        )
