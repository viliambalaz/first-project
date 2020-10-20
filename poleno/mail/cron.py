# vim: expandtab
# -*- coding: utf-8 -*-
import traceback

from django.db import transaction
from django.conf import settings
from django.utils.module_loading import import_by_path

from poleno.cron import cron_job, cron_logger
from poleno.utils.date import utc_now
from poleno.utils.misc import nop

from .models import Message
from .signals import message_sent, message_received


@cron_job(run_every_mins=1)
def mail():
    # Get inbound mail
    path = getattr(settings, u'EMAIL_INBOUND_TRANSPORT', None)
    if path:
        klass = import_by_path(path)
        with klass() as transport:
            messages = transport.get_messages()
            while True:
                try:
                    with transaction.atomic():
                        message = next(messages)
                        nop() # To let tests raise testing exception here.
                    cron_logger.info(u'Received email: {}'.format(message))
                except StopIteration:
                    break
                except Exception:
                    trace = unicode(traceback.format_exc(), u'utf-8')
                    cron_logger.error(u'Receiving emails failed:\n{}'.format(trace))
                    break

    # Process inbound mail; At most 10 messages in one batch
    messages = (Message.objects
            .inbound()
            .not_processed()
            .order_by_pk()
            .prefetch_related(Message.prefetch_recipients())
            )[:10]
    for message in messages:
        try:
            with transaction.atomic():
                message.processed = utc_now()
                message.save(update_fields=[u'processed'])
                message_received.send(sender=None, message=message)
                nop() # To let tests raise testing exception here.
            cron_logger.info(u'Processed received email: {}'.format(message))
        except Exception:
            trace = unicode(traceback.format_exc(), u'utf-8')
            cron_logger.error(u'Processing received email failed: {}\n{}'.format(message, trace))

    # Send outbound mail; At most 10 messages in one batch
    path = getattr(settings, u'EMAIL_OUTBOUND_TRANSPORT', None)
    if path:
        messages = (Message.objects
                .outbound()
                .not_processed()
                .order_by_pk()
                .prefetch_related(Message.prefetch_recipients())
                .prefetch_related(Message.prefetch_attachments())
                )[:10]
        if messages:
            klass = import_by_path(path)
            with klass() as transport:
                for message in messages:
                    try:
                        with transaction.atomic():
                            transport.send_message(message)
                            message.processed = utc_now()
                            message.save(update_fields=[u'processed'])
                            message_sent.send(sender=None, message=message)
                            nop() # To let tests raise testing exception here.
                        cron_logger.info(u'Sent email: {}'.format(message))
                    except Exception:
                        trace = unicode(traceback.format_exc(), u'utf-8')
                        cron_logger.error(u'Sending email failed: {}\n{}'.format(message, trace))
