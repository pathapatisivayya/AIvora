from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.http import JsonResponse
from django.urls import include, path


def root_health(_request):
    """So http://host:8000/ is not a silent 404 when only Gunicorn + API is deployed."""
    return JsonResponse(
        {
            "ok": True,
            "service": "aivora-backend",
            "try": "/api/offerings/services/",
        }
    )


urlpatterns = [
    path("", root_health),
    path("admin/", admin.site.urls),
    path("api/auth/", include("apps.accounts.urls")),
    path("api/offerings/", include("apps.offerings.urls")),
    path("api/portfolio/", include("apps.portfolio.urls")),
    path("api/contact/", include("apps.contact.urls")),
    path("api/careers/", include("apps.careers.urls")),
    path("api/blog/", include("apps.blog.urls")),
    path("api/testimonials/", include("apps.testimonials.urls")),
    path("api/analytics/", include("apps.analytics.urls")),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

admin.site.site_header = "Aivora Solutions Admin"
admin.site.site_title = "Aivora Admin"
