from django.conf import settings
from django.core.mail import send_mail
from django.core.management.base import BaseCommand


class Command(BaseCommand):
    help = "Send one test email via current EMAIL_* settings (verify Gmail / SMTP)."

    def handle(self, *args, **options):
        to_addr = (getattr(settings, "CONTACT_EMAIL_TO", None) or "").strip()
        if not to_addr:
            self.stderr.write("Set CONTACT_EMAIL_TO in .env first.")
            return
        host = getattr(settings, "EMAIL_HOST", "") or ""
        if not host.strip():
            self.stderr.write("Set EMAIL_HOST (e.g. smtp.gmail.com) in .env — otherwise Django uses console backend.")
            return

        from_email = getattr(settings, "DEFAULT_FROM_EMAIL", None) or getattr(
            settings, "EMAIL_HOST_USER", None
        ) or to_addr

        self.stdout.write(f"SMTP host={host} user={getattr(settings, 'EMAIL_HOST_USER', '')!r}")
        self.stdout.write(f"Sending test to {to_addr} from {from_email!r} ...")

        try:
            send_mail(
                subject="[Aivora] SMTP test",
                message="If you received this, Django SMTP is configured correctly.",
                from_email=from_email,
                recipient_list=[to_addr],
                fail_silently=False,
            )
        except Exception as exc:
            self.stderr.write(self.style.ERROR(f"FAILED: {exc}"))
            self.stderr.write(
                "Check: Gmail App Password (16 chars, no spaces), 2-Step Verification on, "
                "EMAIL_HOST_USER matches the Gmail account, restart runserver after .env changes."
            )
            raise

        self.stdout.write(self.style.SUCCESS(f"OK — check inbox (and Spam) for {to_addr}"))
