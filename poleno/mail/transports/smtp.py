# vim: expandtab
# -*- coding: utf-8 -*-
from django.core.mail import get_connection, EmailMultiAlternatives, EmailMessage

from .base import BaseTransport


class SmtpTransport(BaseTransport):
    def __init__(self, *args, **kwargs):
        super(SmtpTransport, self).__init__(*args, **kwargs)
        self.connection = None

    def connect(self):
        self.connection = get_connection(u'django.core.mail.backends.smtp.EmailBackend')
        self.connection.open()

    def disconnect(self):
        self.connection.close()
        self.connection = None

    def send_message(self, message):
        assert message.type == message.TYPES.OUTBOUND
        assert message.processed is None

        kwargs = {}
        kwargs[u'connection'] = self.connection
        kwargs[u'subject'] = message.subject
        kwargs[u'from_email'] = message.from_formatted
        kwargs[u'to'] = (r.formatted for r in message.recipients_to)
        kwargs[u'cc'] = (r.formatted for r in message.recipients_cc)
        kwargs[u'bcc'] = (r.formatted for r in message.recipients_bcc)
        kwargs[u'attachments'] = ((a.name, a.content, a.content_type) for a in message.attachments)
        kwargs[u'headers'] = message.headers

        if message.text and message.html:
            msg = EmailMultiAlternatives(body=message.text, **kwargs)
            msg.attach_alternative(message.html, u'text/html')
        elif message.html:
            msg = EmailMessage(body=message.html, **kwargs)
            msg.content_subtype = u'html'
        else:
            msg = EmailMessage(body=message.text, **kwargs)

        msg.send()

        for recipient in message.recipients:
            recipient.status = recipient.STATUSES.SENT
            recipient.save(update_fields=[u'status'])
