# vim: expandtab
# -*- coding: utf-8 -*-
from testfixtures import TempDirectory

from django.core.files.base import ContentFile
from django.test import TestCase
from django.test.utils import override_settings

from poleno.attachments.models import Attachment
from poleno.utils.date import utc_now

from ..models import Message, Recipient


class MailTestCaseMixin(TestCase):

    def _pre_setup(self):
        super(MailTestCaseMixin, self)._pre_setup()
        self.tempdir = TempDirectory()
        self.settings_override = override_settings(
            MEDIA_ROOT=self.tempdir.path,
            EMAIL_BACKEND=u'poleno.mail.backend.EmailBackend',
            )
        self.settings_override.enable()

    def _post_teardown(self):
        self.settings_override.disable()
        self.tempdir.cleanup()
        super(MailTestCaseMixin, self)._post_teardown()


    def _call_with_defaults(self, func, kwargs, defaults):
        omit = kwargs.pop(u'omit', [])
        defaults.update(kwargs)
        for key in omit:
            defaults.pop(key, None)
        return func(**defaults)

    def _create_attachment(self, **kwargs):
        content = kwargs.pop(u'content', u'Default Testing Content')
        return self._call_with_defaults(Attachment.objects.create, kwargs, {
            u'file': ContentFile(content, name=u'overridden-file-name.bin'),
            u'name': u'default_testing_filename.txt',
            })

    def _create_recipient(self, **kwargs):
        return self._call_with_defaults(Recipient.objects.create, kwargs, {
            u'name': u'Default Testing Name',
            u'mail': u'default_testing_mail@example.com',
            u'type': Recipient.TYPES.TO,
            u'status': Recipient.STATUSES.INBOUND,
            u'status_details': u'',
            u'remote_id': u'',
            })

    def _create_message(self, **kwargs):
        return self._call_with_defaults(Message.objects.create, kwargs, {
            u'type': Message.TYPES.INBOUND,
            u'processed': utc_now(),
            u'from_name': u'Default Testing From Name',
            u'from_mail': u'default_testing_from_mail@example.com',
            u'received_for': u'default_testing_for_mail@example.com',
            u'subject': u'Default Testing Subject',
            u'text': u'Default Testing Text Content',
            u'html': u'<html><body>Default Testing HTML Content</body></html>',
            u'headers': {u'X-Default-Testing-Extra-Header': u'Default Testing Value'},
            })
