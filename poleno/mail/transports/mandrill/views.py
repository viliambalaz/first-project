# vim: expandtab
# -*- coding: utf-8 -*-
import hashlib
import hmac
import json
from base64 import b64encode

from django.core.exceptions import ImproperlyConfigured, SuspiciousOperation
from django.db import transaction
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse
from django.conf import settings

from poleno.utils.views import secure_required

from .signals import webhook_event


@require_http_methods([u'HEAD', u'GET', u'POST'])
@csrf_exempt
@secure_required(raise_exception=True)
@transaction.atomic
def webhook(request):
    # Based on djrill.views.DjrillWebhookView
    secret = getattr(settings, u'MANDRILL_WEBHOOK_SECRET', None)
    secret_name = getattr(settings, u'MANDRILL_WEBHOOK_SECRET_NAME', u'secret')
    webhook_keys = getattr(settings, u'MANDRILL_WEBHOOK_KEYS', None)
    webhook_url = getattr(settings, u'MANDRILL_WEBHOOK_URL', None)

    if not secret:
        raise ImproperlyConfigured(u'Setting MANDRILL_WEBHOOK_SECRET is not set.')
    if request.GET.get(secret_name) != secret:
        raise SuspiciousOperation(u'Secret does not match')

    if request.method == u'POST':
        if not webhook_url:
            raise ImproperlyConfigured(u'Setting MANDRILL_WEBHOOK_URL is not set.')
        if not webhook_keys:
            raise ImproperlyConfigured(u'Setting MANDRILL_WEBHOOK_KEYS is not set.')

        signature = request.META.get(u'HTTP_X_MANDRILL_SIGNATURE', None)
        if not signature:
            raise SuspiciousOperation(u'X-Mandrill-Signature not set')

        post_parts = [webhook_url]
        post_lists = sorted(request.POST.lists())
        for key, value_list in post_lists:
            for item in value_list:
                post_parts.extend([key, item])
        post_string_encoded = u''.join(post_parts).encode(u'ascii', u'ignore')
        for webhook_key in webhook_keys:
            webhook_key_encoded = webhook_key.encode(u'ascii', u'ignore')
            hash_string = b64encode(hmac.new(key=webhook_key_encoded, msg=post_string_encoded,
                    digestmod=hashlib.sha1).digest())
            if signature == hash_string:
                break
        else:
            raise SuspiciousOperation(u'Signature does not match')

        try:
            data = json.loads(request.POST.get(u'mandrill_events'))
        except (TypeError, ValueError):
            raise SuspiciousOperation(u'Request syntax error')
        for event in data:
            webhook_event.send(sender=None, event_type=event[u'event'], data=event)

    return HttpResponse()
