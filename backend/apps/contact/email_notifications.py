"""Staff notification when a new inquiry is submitted."""

import logging
import re

from django.conf import settings
from django.core.mail import EmailMessage, EmailMultiAlternatives
from django.utils.html import escape

logger = logging.getLogger(__name__)


def _smtp_from_email():
    """Gmail works most reliably when From matches the authenticated account."""
    user = (getattr(settings, "EMAIL_HOST_USER", None) or "").strip()
    display = (getattr(settings, "DEFAULT_FROM_EMAIL", None) or "").strip()
    if display:
        return display
    return user or "noreply@localhost"


def _ascii_subject(inquiry) -> str:
    """RFC-friendly subject (some SMTP paths choke on odd Unicode in Subject)."""
    raw = (inquiry.subject or "No subject").strip()
    raw = re.sub(r"[\r\n]+", " ", raw)
    return f"[Aivora] New inquiry: {raw}"[:200]


def _plain_send(subject: str, text_body: str, from_email: str, to_addr: str, reply_to: list[str]) -> bool:
    """Same code path as `send_test_email` (plain EmailMessage) — most compatible with Gmail."""
    kwargs = {
        "subject": subject,
        "body": text_body,
        "from_email": from_email,
        "to": [to_addr],
    }
    if reply_to:
        kwargs["reply_to"] = reply_to
    msg = EmailMessage(**kwargs)
    sent = msg.send(fail_silently=False)
    return bool(sent)


def send_staff_inquiry_notification(inquiry) -> bool:
    """
    Sends HTML + plain-text email to CONTACT_EMAIL_TO.
    Reply-To is the visitor so staff can hit Reply.
    Falls back to plain text if multipart send fails.
    """
    to_addr = (getattr(settings, "CONTACT_EMAIL_TO", None) or "").strip()
    if not to_addr:
        logger.warning("CONTACT_EMAIL_TO is empty — inquiry #%s saved but no email sent.", inquiry.pk)
        return False

    from_email = _smtp_from_email()
    subject = _ascii_subject(inquiry)

    name = inquiry.name or "—"
    email = (getattr(inquiry, "email", None) or "").strip() or "—"
    phone = (inquiry.phone or "").strip() or "Not provided"
    company = (inquiry.company or "").strip() or "—"
    body_text = inquiry.message or ""

    text_body = (
        f"A new inquiry arrived from the Aivora Solutions website.\n\n"
        f"--------------------------------------\n"
        f"SUBJECT\n{inquiry.subject}\n\n"
        f"FROM\n{name}\n{email}\n\n"
        f"PHONE\n{phone}\n\n"
        f"COMPANY\n{company}\n\n"
        f"MESSAGE\n{body_text}\n\n"
        f"--------------------------------------\n"
        f"Inquiry ID: #{inquiry.pk}\n"
        f"Source: {inquiry.source or 'website'}\n"
        f"Reply directly to: {email}\n"
    )

    def safe(s):
        return escape(str(s)) if s is not None else "—"

    html_body = f"""<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width"/></head>
<body style="margin:0;padding:24px;background:#0f172a;font-family:Segoe UI,system-ui,sans-serif;color:#e2e8f0;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;margin:0 auto;">
    <tr>
      <td style="background:linear-gradient(135deg,#0ea5e933 0%,#8b5cf622 100%);border-radius:16px;padding:1px;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#111827;border-radius:15px;overflow:hidden;">
          <tr>
            <td style="padding:24px 24px 8px;">
              <p style="margin:0;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:#67e8f9;">Aivora Solutions</p>
              <h1 style="margin:8px 0 0;font-size:20px;font-weight:700;color:#f8fafc;">New website inquiry</h1>
              <p style="margin:12px 0 0;font-size:15px;color:#cbd5e1;line-height:1.5;">Someone submitted the contact form. Use Reply in your mail client — it goes to the visitor.</p>
            </td>
          </tr>
          <tr>
            <td style="padding:8px 24px 24px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;">
                <tr><td colspan="2" style="padding:12px 0;border-bottom:1px solid #334155;">
                  <p style="margin:0;font-size:10px;letter-spacing:0.12em;text-transform:uppercase;color:#94a3b8;">Subject</p>
                  <p style="margin:6px 0 0;font-size:16px;font-weight:600;color:#f1f5f9;">{safe(inquiry.subject)}</p>
                </td></tr>
                <tr><td style="padding:14px 12px 14px 0;border-bottom:1px solid #334155;vertical-align:top;width:38%;">
                  <p style="margin:0;font-size:10px;letter-spacing:0.12em;text-transform:uppercase;color:#94a3b8;">Name</p>
                  <p style="margin:6px 0 0;font-size:14px;color:#e2e8f0;">{safe(name)}</p>
                </td><td style="padding:14px 0 14px 12px;border-bottom:1px solid #334155;vertical-align:top;">
                  <p style="margin:0;font-size:10px;letter-spacing:0.12em;text-transform:uppercase;color:#94a3b8;">Email</p>
                  <p style="margin:6px 0 0;font-size:14px;"><a href="mailto:{safe(email)}" style="color:#67e8f9;text-decoration:none;">{safe(email)}</a></p>
                </td></tr>
                <tr><td style="padding:14px 12px 14px 0;border-bottom:1px solid #334155;vertical-align:top;">
                  <p style="margin:0;font-size:10px;letter-spacing:0.12em;text-transform:uppercase;color:#94a3b8;">Phone</p>
                  <p style="margin:6px 0 0;font-size:14px;color:#e2e8f0;">{safe(phone)}</p>
                </td><td style="padding:14px 0 14px 12px;border-bottom:1px solid #334155;vertical-align:top;">
                  <p style="margin:0;font-size:10px;letter-spacing:0.12em;text-transform:uppercase;color:#94a3b8;">Company</p>
                  <p style="margin:6px 0 0;font-size:14px;color:#e2e8f0;">{safe(company)}</p>
                </td></tr>
                <tr><td colspan="2" style="padding:16px 0 0;">
                  <p style="margin:0;font-size:10px;letter-spacing:0.12em;text-transform:uppercase;color:#94a3b8;">Message</p>
                  <div style="margin:10px 0 0;padding:14px;background:#1e293b;border-radius:10px;border:1px solid #334155;font-size:14px;line-height:1.6;color:#e2e8f0;white-space:pre-wrap;">{safe(body_text)}</div>
                </td></tr>
              </table>
              <p style="margin:20px 0 0;font-size:12px;color:#64748b;">Inquiry #{inquiry.pk} · Source: {safe(inquiry.source or "website")}</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>"""

    # Avoid invalid / duplicate Reply-To when visitor uses same inbox as CONTACT_EMAIL_TO
    reply_to: list[str] = []
    if email and email != "—" and email.lower() != to_addr.lower():
        reply_to = [email]

    msg = EmailMultiAlternatives(
        subject=subject,
        body=text_body,
        from_email=from_email,
        to=[to_addr],
        reply_to=reply_to,
        headers={"X-Aivora-Inquiry-Id": str(inquiry.pk)},
    )
    msg.attach_alternative(html_body, "text/html")

    try:
        sent = msg.send(fail_silently=False)
        if sent:
            logger.info("Inquiry #%s HTML notification sent to %s", inquiry.pk, to_addr)
        else:
            logger.warning("Inquiry #%s send returned 0; retrying plain text.", inquiry.pk)
            return _plain_send(subject, text_body, from_email, to_addr, reply_to)
        return bool(sent)
    except Exception as exc:
        logger.warning("Inquiry #%s multipart send failed (%s); retrying plain text.", inquiry.pk, exc)
        try:
            ok = _plain_send(subject, text_body, from_email, to_addr, reply_to)
            if ok:
                logger.info("Inquiry #%s plain-text notification sent to %s", inquiry.pk, to_addr)
            return ok
        except Exception as exc2:
            logger.exception(
                "SMTP failed for inquiry #%s after fallback (to=%s from=%s): %s",
                inquiry.pk,
                to_addr,
                from_email,
                exc2,
            )
            return False
