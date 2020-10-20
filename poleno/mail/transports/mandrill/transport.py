# vim: expandtab
# -*- coding: utf-8 -*-
import json
import base64
import requests
from collections import defaultdict

from django.core.exceptions import ImproperlyConfigured
from django.conf import settings

from poleno.utils.misc import squeeze

from ..base import BaseTransport


class MandrillTransport(BaseTransport):
    def __init__(self, **kwargs):
        super(MandrillTransport, self).__init__(**kwargs)
        self.api_key = getattr(settings, u'MANDRILL_API_KEY', None)
        self.api_url = getattr(settings, u'MANDRILL_API_URL', u'https://mandrillapp.com/api/1.0')
        self.api_send = self.api_url.rstrip(u'/') + u'/messages/send.json'

        if self.api_key is None:
            raise ImproperlyConfigured(u'Setting MANDRILL_API_KEY is not set.')

    def send_message(self, message):
        assert message.type == message.TYPES.OUTBOUND
        assert message.processed is None

        # Based on djrill.mail.backends.DjrillBackend; We can't use Djrill directly because it
        # sends the mail synchronously during user requests.
        msg = {}
        msg[u'subject'] = message.subject
        msg[u'from_email'] = message.from_mail
        if message.from_name:
            msg[u'from_name'] = message.from_name
        if message.html:
            msg[u'html'] = message.html
        if message.text:
            msg[u'text'] = message.text
        if message.headers:
            msg[u'headers'] = message.headers

        msg[u'to'] = []
        recipients = defaultdict(list)
        for recipient in message.recipients:
            rcp = {}
            rcp[u'email'] = recipient.mail
            if recipient.name:
                rcp[u'name'] = recipient.name
            if recipient.type == recipient.TYPES.TO:
                rcp[u'type'] = u'to'
            elif recipient.type == recipient.TYPES.CC:
                rcp[u'type'] = u'cc'
            else:
                assert recipient.type == recipient.TYPES.BCC
                rcp[u'type'] = u'bcc'
            msg[u'to'].append(rcp)
            recipients[recipient.mail].append(recipient)

        msg[u'attachments'] = []
        for attachment in message.attachments:
            attch = {}
            attch[u'type'] = attachment.content_type
            attch[u'name'] = attachment.name
            attch[u'content'] = base64.b64encode(attachment.content)
            msg[u'attachments'].append(attch)

        data = {}
        data[u'key'] = self.api_key
        data[u'message'] = msg

        response = requests.post(self.api_send, data=json.dumps(data))

        if response.status_code != 200:
            raise RuntimeError(squeeze(u"""
                    Sending Message(pk={}) failed with status code {}. Mandrill response: {}
                    """).format(message.pk, response.status_code, response.text))

        for rcp in response.json():
            for recipient in recipients[rcp[u'email']]:
                recipient.remote_id = rcp[u'_id']

                if rcp[u'status'] == u'sent':
                    recipient.status = recipient.STATUSES.SENT
                elif rcp[u'status'] in [u'queued', u'scheduled']:
                    recipient.status = recipient.STATUSES.QUEUED
                elif rcp[u'status'] == u'rejected':
                    recipient.status = recipient.STATUSES.REJECTED
                    recipient.status_details = rcp[u'reject_reason']
                elif rcp[u'status'] == u'invalid':
                    recipient.status = recipient.STATUSES.INVALID
                else:
                    recipient.status = recipient.STATUSES.UNDEFINED

                recipient.save(update_fields=[u'remote_id', u'status', u'status_details'])
