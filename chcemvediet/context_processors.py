# vim: expandtab
# -*- coding: utf-8 -*-
from django.conf import settings as django_settings


def settings(request):
    return {
        u'DEBUG': django_settings.DEBUG,
        u'INSTALLED_APPS': django_settings.INSTALLED_APPS,
        u'DEVBAR_MESSAGE': django_settings.DEVBAR_MESSAGE,
        u'SEARCH_API_KEY': django_settings.SEARCH_API_KEY,
        }
