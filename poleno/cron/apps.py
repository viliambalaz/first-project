# vim: expandtab
# -*- coding: utf-8 -*-
import warnings

from django.apps import AppConfig


class CronConfig(AppConfig):
    name = u'poleno.cron'

    def ready(self):
        from . import signals

        # Django_cron works with timezone aware dates incorrectly, what causes annoying warnings.
        # Until it's fixed, we suppress these warnings.
        # See also: https://github.com/Tivix/django-cron/issues/23
        warnings.filterwarnings(u'ignore',
                message=u'DateTimeField CronJobLog.start_time received a naive datetime',
                category=RuntimeWarning,
                )
