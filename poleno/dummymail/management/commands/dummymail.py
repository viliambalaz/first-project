# vim: expandtab
# -*- coding: utf-8 -*-
import sys
import time
from textwrap import dedent
from optparse import make_option
from multiprocessing import Process
from email.utils import formatdate

import localmail
from twisted.python import log

from django.core.management.base import NoArgsCommand


class Command(NoArgsCommand):
    # Default ports
    default_outgoing_smtp_port = 1025
    default_outgoing_imap_port = 1143
    default_incoming_smtp_port = 2025
    default_incoming_imap_port = 2143

    help = dedent(u"""\
        Creates a dummy e-mail infrastructure for local development.

        This command runs two pairs of dummy SMTP and IMAP servers on localhost. One
        pair is for outgoing mails and one for incoming mails. By default, outgoing
        SMPT server runs on port number `{o_smtp}`, incoming SMTP server on port number
        `{i_smtp}`, outgoing IMAP server on port number `{o_imap}` and incoming IMAP server on
        port number `{o_imap}`. You may change these port numbers with options.

        During the development, you may use this infrastructure to simulate the site
        communication with the outside world with no risk of sending any real e-mails
        to the outside world. In this setting, the outside world will be represented by
        you, the side developer and/or tester. This means that all e-mails sent from
        the site will be delivered to your IMAP client instead of their real
        destination.

        The site is expected to send its outgoing mails to the outgoing SMTP server and
        fetch its incoming mails from the incoming IMAP server. On the other side, if
        you (representing the outside world) want to send an email to the site, you
        have to send it to the incoming SMTP server. If you want to read the mails sent
        by the site, you should fetch them from the outgoing IMAP server. Never try to
        connect to outgoing SMPT server nor the incoming IMAP server. Only the site
        should connect to them. We run two separate pairs of SMPT and IMAP servers in
        order to make sure the messages from the site will not confuse with the
        messages from the outside world.

        You may use any common IMAP e-mail client to connect to the incoming SMTP
        server and the outgoing IMAP server. However, some e-mail clients (e.g.
        Thunderbird) get confused when the server infrastructure restarts and refuse to
        fetch any messages any more. Restarting the client should help. Sometimes, some
        clients (e.g. Thunderbird) refuse to fetch some messages for no apparent
        reason. If such case, try some other client, or try to send the message once
        again.

        Note: No real e-mails are sent anywhere. The SMTP server is dummy and will
        never relay any received message to any other SMTP server. Instead, it will
        store it locally in the memory and make it available via dummy IMAP server. So,
        it's safe to send any message, from any e-mail address to any e-mail address
        whatsoever. Nothing will be delivered. Also note, that all e-mails are stored
        in the memory only, so they will disappear when the infrastructure is
        restarted.""".format(
            o_smtp=default_outgoing_smtp_port,
            o_imap=default_outgoing_imap_port,
            i_smtp=default_incoming_smtp_port,
            i_imap=default_incoming_imap_port,
            ))

    option_list = NoArgsCommand.option_list + (
        make_option(u'--out-smtp-port', action=u'store', type=u'int', dest=u'outgoing_smtp_port',
            default=default_outgoing_smtp_port,
            help=u'Port to use for the outgoing SMTP server. Defaults to {}.'.format(
                default_outgoing_smtp_port)),
        make_option(u'--out-imap-port', action=u'store', type=u'int', dest=u'outgoing_imap_port',
            default=default_outgoing_imap_port,
            help=u'Port to use for the outgoing IMAP server. Defaults to {}.'.format(
                default_outgoing_imap_port)),
        make_option(u'--in-smtp-port', action=u'store', type=u'int', dest=u'incoming_smtp_port',
            default=default_incoming_smtp_port,
            help=u'Port to use for the incoming SMTP server. Defaults to {}.'.format(
                default_incoming_smtp_port)),
        make_option(u'--in-imap-port', action=u'store', type=u'int', dest=u'incoming_imap_port',
            default=default_incoming_imap_port,
            help=u'Port to use for the incoming IMAP server. Defaults to {}.'.format(
                default_incoming_imap_port)),
        )

    def handle_noargs(self, **options):
        outgoing_smtp_port = options[u'outgoing_smtp_port']
        outgoing_imap_port = options[u'outgoing_imap_port']
        incoming_smtp_port = options[u'incoming_smtp_port']
        incoming_imap_port = options[u'incoming_imap_port']

        log.startLogging(sys.stdout)

        # ``localmail`` crashes with many IMAP clients (e.g. mutt) because it does not set ``date``
        # property of ``localmail.inbox.Message`` and then crashes because the ``date`` is
        # ``None``. Our workaround wraps ``MemoryIMAPMailbox`` method ``addMessage`` and force
        # today date if no date is given. The workaround is an ugly hack messing with ``localmail``
        # internals, but I don't see any other war how to fix it besides directly fixing
        # ``localmail`` sources.
        #
        # NOTE: As of 2014-07-24, the bug is fixed in ``localmail`` trunk version, but there is no
        # fixed package on pypi, yet. (2014-09-09)
        addMessage_wrapped = localmail.inbox.MemoryIMAPMailbox.addMessage
        def addMessage(self, msg_fp, flags=None, date=None): # pragma: no cover
            if not date:
                date = formatdate()
            addMessage_wrapped(self, msg_fp, flags, date)
        localmail.inbox.MemoryIMAPMailbox.addMessage = addMessage

        p1 = Process(target=localmail.run, args=(outgoing_smtp_port, outgoing_imap_port))
        p1.daemon = True
        p1.start()

        p2 = Process(target=localmail.run, args=(incoming_smtp_port, incoming_imap_port))
        p2.daemon = True
        p2.start()

        try:
            while True:
                time.sleep(1)
        except KeyboardInterrupt:
            pass
