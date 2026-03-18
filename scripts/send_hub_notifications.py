#!/usr/bin/env python3
import argparse
import json
import os
import smtplib
import ssl
import subprocess
import sys
import tempfile
from email.message import EmailMessage
SMTP_HOST = "smtp.mail.me.com"
SMTP_PORT = 587


class HubClient:
    def __init__(self, base_url):
        self.base_url = base_url.rstrip("/")
        handle = tempfile.NamedTemporaryFile(prefix="hub_notify_cookie_", suffix=".txt", delete=False)
        self.cookie_file = handle.name
        handle.close()

    def request_json(self, method, path, payload=None):
        url = f"{self.base_url}{path}"
        cmd = ["curl", "-sS", "-X", method, "-c", self.cookie_file, "-b", self.cookie_file]
        if payload is not None:
            cmd += ["-H", "content-type: application/json", "-d", json.dumps(payload)]
        cmd.append(url)
        result = subprocess.run(cmd, capture_output=True, text=True)
        if result.returncode != 0:
            raise RuntimeError(f"curl failed for {method} {url}: {result.stderr.strip()}")
        try:
            return json.loads(result.stdout)
        except json.JSONDecodeError as exc:
            raise RuntimeError(f"Invalid JSON from {method} {url}: {result.stdout[:400]}") from exc

    def close(self):
        try:
            os.remove(self.cookie_file)
        except FileNotFoundError:
            pass


def login_admin(client, admin_email):
    payload = {"email": admin_email}
    response = client.request_json("POST", "/api/admin-auth/login", payload)
    if not response.get("ok"):
        raise RuntimeError("Admin login failed")


def fetch_preview(client, kind):
    response = client.request_json("GET", f"/api/admin-notifications/preview?kind={kind}")
    if not response.get("ok"):
        raise RuntimeError(f"Preview failed for {kind}")
    return response["preview"]


def mark_sent(client, payload):
    response = client.request_json("POST", "/api/admin-notifications/mark-sent", payload)
    if not response.get("ok"):
        raise RuntimeError(f"Mark sent failed for {payload.get('kind')}")


def build_message(sender, to_list, bcc_list, subject, html, text):
    msg = EmailMessage()
    msg["From"] = sender
    msg["To"] = ", ".join(to_list)
    if bcc_list:
        msg["Bcc"] = ", ".join(bcc_list)
    msg["Subject"] = subject
    msg.set_content(text)
    msg.add_alternative(html, subtype="html")
    return msg


def smtp_send(sender, password, msg):
    context = ssl.create_default_context()
    with smtplib.SMTP(SMTP_HOST, SMTP_PORT, timeout=30) as server:
        server.ehlo()
        server.starttls(context=context)
        server.ehlo()
        server.login(sender, password)
        server.send_message(msg)


def send_initial(client, sender, password, dry_run, override_to=None):
    preview = fetch_preview(client, "initial-hub")
    recipients = preview.get("recipients", [])
    pills = preview.get("pills", [])
    if not recipients:
        print("No active recipients for initial-hub")
        return
    effective_recipients = [override_to] if override_to else recipients
    msg = build_message(
        sender=sender,
        to_list=[sender],
        bcc_list=effective_recipients,
        subject=preview["subject"],
        html=preview["html"],
        text=preview["text"],
    )
    if not dry_run:
        smtp_send(sender, password, msg)
        if not override_to:
            mark_sent(client, {
                "kind": "initial-hub",
                "recipients": len(recipients),
                "pills": len(pills),
            })
    print(f"initial-hub: recipients={len(effective_recipients)} pills={len(pills)} dry_run={dry_run} override_to={override_to or '-'}")


def send_daily(client, sender, password, dry_run, override_to=None):
    preview = fetch_preview(client, "daily-pills")
    recipients = preview.get("recipients", [])
    pills = preview.get("pills", [])
    if not recipients or not pills:
        print("No pending daily pills to send")
        return
    effective_recipients = [override_to] if override_to else recipients
    msg = build_message(
        sender=sender,
        to_list=[sender],
        bcc_list=effective_recipients,
        subject=preview["subject"],
        html=preview["html"],
        text=preview["text"],
    )
    if not dry_run:
        smtp_send(sender, password, msg)
        if not override_to:
            mark_sent(client, {
                "kind": "daily-pills",
                "notificationKeys": [pill["notificationKey"] for pill in pills],
            })
    print(f"daily-pills: recipients={len(effective_recipients)} pills={len(pills)} dry_run={dry_run} override_to={override_to or '-'}")


def send_weekly(client, sender, password, dry_run, override_to=None):
    previews = fetch_preview(client, "weekly-comments")
    if not previews:
        print("No pending weekly comment digests")
        return
    sent_comment_ids = []
    for digest in previews:
        msg = build_message(
            sender=sender,
            to_list=[override_to or digest["authorEmail"]],
            bcc_list=[],
            subject=digest["subject"],
            html=digest["html"],
            text=digest["text"],
        )
        if not dry_run:
            smtp_send(sender, password, msg)
            if not override_to:
                sent_comment_ids.extend(digest["commentIds"])
        print(f"weekly-comments: author={override_to or digest['authorEmail']} comments={len(digest['commentIds'])} dry_run={dry_run}")
    if sent_comment_ids and not dry_run and not override_to:
        mark_sent(client, {
            "kind": "weekly-comments",
            "commentIds": sent_comment_ids,
        })


def main():
    parser = argparse.ArgumentParser(description="Send Hub notifications via iCloud SMTP")
    parser.add_argument("--kind", choices=["initial-hub", "daily-pills", "weekly-comments"], required=True)
    parser.add_argument("--base-url", default="https://repositorio-para-web-pildoras.svallejo-351.workers.dev")
    parser.add_argument("--admin-email", default="svallejoi@icloud.com")
    parser.add_argument("--sender-email", default="svallejoi@icloud.com")
    parser.add_argument("--dry-run", action="store_true")
    parser.add_argument("--override-to")
    args = parser.parse_args()

    password = os.environ.get("ICLOUD_APP_PASSWORD")
    if not args.dry_run and not password:
        print("Missing ICLOUD_APP_PASSWORD in environment", file=sys.stderr)
        return 1

    client = HubClient(args.base_url)
    try:
        login_admin(client, args.admin_email)

        if args.kind == "initial-hub":
            send_initial(client, args.sender_email, password, args.dry_run, args.override_to)
        elif args.kind == "daily-pills":
            send_daily(client, args.sender_email, password, args.dry_run, args.override_to)
        else:
            send_weekly(client, args.sender_email, password, args.dry_run, args.override_to)
        return 0
    finally:
        client.close()


if __name__ == "__main__":
    raise SystemExit(main())
