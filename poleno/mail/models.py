# vim: expandtab
# -*- coding: utf-8 -*-
from email.utils import formataddr, parseaddr

from django.db import models
from django.db.models import Prefetch
from django.utils.translation import ugettext_lazy as _
from django.utils.html import escape
from django.utils.functional import cached_property
from django.contrib.contenttypes import generic

from jsonfield import JSONField

from poleno.attachments.models import Attachment
from poleno.utils.models import FieldChoices, QuerySet, join_lookup
from poleno.utils.misc import FormatMixin, squeeze


class MessageQuerySet(QuerySet):
    def inbound(self):
        return self.filter(type=Message.TYPES.INBOUND)
    def outbound(self):
        return self.filter(type=Message.TYPES.OUTBOUND)
    def processed(self):
        return self.filter(processed__isnull=False)
    def not_processed(self):
        return self.filter(processed__isnull=True)
    def order_by_pk(self):
        return self.order_by(u'pk')
    def order_by_created(self):
        return self.order_by(u'created', u'pk')
    def order_by_processed(self):
        return self.order_by(u'processed', u'pk')

class Message(FormatMixin, models.Model):
    # May NOT be NULL
    TYPES = FieldChoices(
            (u'INBOUND',  1, _(u'mail:Message:type:INBOUND')),
            (u'OUTBOUND', 2, _(u'mail:Message:type:OUTBOUND')),
            )
    type = models.SmallIntegerField(choices=TYPES._choices)

    # May NOT be NULL
    created = models.DateTimeField(auto_now_add=True,
            help_text=squeeze(u"""
                Date and time the message object was created,
                """))

    # NOT NULL for processed messages; NULL for queued messages
    processed = models.DateTimeField(blank=True, null=True,
            help_text=squeeze(u"""
                Date and time the message was sent or received and processed. Leave blank if you
                want the application to process it.
                """))

    # May be empty
    from_name = models.CharField(blank=True, max_length=255,
            help_text=escape(squeeze(u"""
                Sender full name. For instance setting name to "John Smith" and e-mail to
                "smith@example.com" will set the sender address to "John Smith <smith@example.com>".
                """)))

    # Should NOT be empty
    from_mail = models.EmailField(max_length=255,
            help_text=squeeze(u"""
                Sender e-mail address, e.g. "smith@example.com".
                """))

    # May be empty for inbound messages; Empty for outbound messages
    received_for = models.EmailField(blank=True, max_length=255,
            help_text=squeeze(u"""
                The address we received the massage for. It may, but does not have to be among the
                message recipients, as the address may have heen bcc-ed to. The address is empty
                for all outbound messages. It may also be empty for inbound messages if we don't
                know it, or the used mail transport does not support it.
                """))

    # May be empty
    subject = models.CharField(blank=True, max_length=255)

    # May be empty
    text = models.TextField(blank=True,
            help_text=squeeze(u"""
                "text/plain" message body alternative.
                """))
    html = models.TextField(blank=True,
            help_text=squeeze(u"""
                "text/html" message body alternative.
                """))

    # Dict: String->(String|[String]); May be empty
    headers = JSONField(blank=True, default={},
            help_text=squeeze(u"""
                Dictionary mapping header names to their values, or lists of their values. For
                outbound messages it contains only extra headers added by the sender. For inbound
                messages it contains all message headers.
                """))

    # May be empty; Backward generic relation
    attachment_set = generic.GenericRelation(u'attachments.Attachment',
            content_type_field=u'generic_type', object_id_field=u'generic_id')

    # Backward relations:
    #
    #  -- recipient_set: by Recipient.message
    #     Should NOT be empty

    # Indexes:
    #  -- processed, id: index_together
    #  -- created, id:   index_together

    objects = MessageQuerySet.as_manager()

    class Meta:
        index_together = [
                [u'processed', u'id'],
                [u'created', u'id'],
                ]

    @property
    def from_formatted(self):
        return formataddr((self.from_name, self.from_mail))

    @from_formatted.setter
    def from_formatted(self, value):
        self.from_name, self.from_mail = parseaddr(value)

    @staticmethod
    def prefetch_attachments(path=None, queryset=None):
        u"""
        Use to prefetch ``Message.attachments``.
        """
        if queryset is None:
            queryset = Attachment.objects.get_queryset()
        queryset = queryset.order_by_pk()
        return Prefetch(join_lookup(path, u'attachment_set'), queryset, to_attr=u'attachments')

    @cached_property
    def attachments(self):
        u"""
        Cached list of all message attachments ordered by ``pk``. May be prefetched with
        ``prefetch_related(Message.prefetch_attachments())`` queryset method.
        """
        return list(self.attachment_set.order_by_pk())

    @staticmethod
    def prefetch_recipients(path=None, queryset=None):
        u"""
        Use to prefetch ``Message.recipients``.
        """
        if queryset is None:
            queryset = Recipient.objects.get_queryset()
        queryset = queryset.order_by_pk()
        return Prefetch(join_lookup(path, u'recipient_set'), queryset, to_attr=u'recipients')

    @cached_property
    def recipients(self):
        u"""
        Cached list of all message recipients ordered by ``pk``. May be prefetched with
        ``prefetch_related(Message.prefetch_recipients())`` queryset method.
        """
        return list(self.recipient_set.order_by_pk())

    @cached_property
    def recipients_to(self):
        u"""
        Cached list of all message "to" recipients ordered by ``pk``. Takes advantage of
        ``Message.recipients`` if it is already fetched.
        """
        if u'recipients' in self.__dict__:
            return list(r for r in self.recipients if r.type == Recipient.TYPES.TO)
        else:
            return list(self.recipient_set.to().order_by_pk())

    @cached_property
    def recipients_cc(self):
        u"""
        Cached list of all message "cc" recipients ordered by ``pk``. Takes advantage of
        ``Message.recipients`` if it is already fetched.
        """
        if u'recipients' in self.__dict__:
            return list(r for r in self.recipients if r.type == Recipient.TYPES.CC)
        else:
            return list(self.recipient_set.cc().order_by_pk())

    @cached_property
    def recipients_bcc(self):
        u"""
        Cached list of all message "bcc" recipients ordered by ``pk``. Takes advantage of
        ``Message.recipients`` if it is already fetched.
        """
        if u'recipients' in self.__dict__:
            return list(r for r in self.recipients if r.type == Recipient.TYPES.BCC)
        else:
            return list(self.recipient_set.bcc().order_by_pk())

    @cached_property
    def to_formatted(self):
        return u', '.join(r.formatted for r in self.recipients_to)

    @cached_property
    def cc_formatted(self):
        return u', '.join(r.formatted for r in self.recipients_cc)

    @cached_property
    def bcc_formatted(self):
        return u', '.join(r.formatted for r in self.recipients_bcc)

    def __unicode__(self):
        return format(self.pk)


class RecipientQuerySet(QuerySet):
    def to(self):
        return self.filter(type=Recipient.TYPES.TO)
    def cc(self):
        return self.filter(type=Recipient.TYPES.CC)
    def bcc(self):
        return self.filter(type=Recipient.TYPES.BCC)
    def order_by_pk(self):
        return self.order_by(u'pk')

class Recipient(FormatMixin, models.Model):
    # May NOT be NULL
    message = models.ForeignKey(u'Message')

    # May be empty
    name = models.CharField(blank=True, max_length=255,
            help_text=escape(squeeze(u"""
                Recipient full name. For instance setting name to "John Smith" and e-mail to
                "smith@example.com" will send the message to "John Smith <smith@example.com>".
                """)))

    # Should NOT be empty
    mail = models.EmailField(max_length=255,
            help_text=u'Recipient e-mail address, e.g. "smith@example.com".')

    # May NOT be NULL
    TYPES = FieldChoices(
            (u'TO',  1, _(u'mail:Recipient:type:TO')),
            (u'CC',  2, _(u'mail:Recipient:type:CC')),
            (u'BCC', 3, _(u'mail:Recipient:type:BCC')),
            )
    type = models.SmallIntegerField(choices=TYPES._choices,
            help_text=u'Recipient type: To, Cc, or Bcc.')

    # May NOT be NULL
    STATUSES = FieldChoices(
            # For inbound messages
            (u'INBOUND',   8, _(u'mail:Recipient:status:INBOUND')),
            # For outbound messages
            (u'UNDEFINED', 1, _(u'mail:Recipient:status:UNDEFINED')),
            (u'QUEUED',    2, _(u'mail:Recipient:status:QUEUED')),
            (u'REJECTED',  3, _(u'mail:Recipient:status:REJECTED')),
            (u'INVALID',   4, _(u'mail:Recipient:status:INVALID')),
            (u'SENT',      5, _(u'mail:Recipient:status:SENT')),
            (u'DELIVERED', 6, _(u'mail:Recipient:status:DELIVERED')),
            (u'OPENED',    7, _(u'mail:Recipient:status:OPENED')),
            )
    INBOUND_STATUSES = (
            STATUSES.INBOUND,
            )
    OUTBOUND_STATUSES = (
            STATUSES.UNDEFINED,
            STATUSES.QUEUED,
            STATUSES.REJECTED,
            STATUSES.INVALID,
            STATUSES.SENT,
            STATUSES.DELIVERED,
            STATUSES.OPENED,
            )
    status = models.SmallIntegerField(choices=STATUSES._choices,
            help_text=squeeze(u"""
                Delivery status for the message recipient. It must be "Inbound" for inbound mesages
                or one of the remaining statuses for outbound messages.
                """))

    # May be empty
    status_details = models.CharField(blank=True, max_length=255,
            help_text=squeeze(u"""
                Unspecific delivery status details set by e-mail transport. Leave blank if not
                sure.
                """))

    # May be empty
    remote_id = models.CharField(blank=True, max_length=255, db_index=True,
            help_text=squeeze(u"""
                Recipient reference ID set by e-mail transport. Leave blank if not sure.
                """))

    # Backward relations added to other models:
    #
    #  -- Message.recipient_set
    #     Should NOT be empty

    # Indexes:
    #  -- message:   ForeignKey
    #  -- remote_id: on field

    objects = RecipientQuerySet.as_manager()

    @property
    def formatted(self):
        return formataddr((self.name, self.mail))

    @formatted.setter
    def formatted(self, value):
        self.name, self.mail = parseaddr(value)

    def __unicode__(self):
        return u'[{}] {}'.format(self.pk, self.mail)
