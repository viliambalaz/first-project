# vim: expandtab
# -*- coding: utf-8 -*-
from django.core.exceptions import SuspiciousOperation
from django.http import HttpResponseRedirect

from poleno.utils.forms import clean_button

from .wizard import WizzardRollback


def wizard_view(wizard_class, request, index, *args, **kwargs):
    try:
        wizard = wizard_class(request, index, *args, **kwargs)
    except WizzardRollback as e:
        return HttpResponseRedirect(e.step.get_url())

    if request.method != u'POST':
        return wizard.current_step.render()

    button = clean_button(request.POST, [u'save', u'next'])

    if button == u'save':
        wizard.commit()
        return HttpResponseRedirect(wizard.current_step.get_url())

    if button == u'next':
        if not wizard.current_step.is_valid():
            return wizard.current_step.render()
        wizard.commit()
        if not wizard.current_step.is_last():
            return HttpResponseRedirect(wizard.next_step().get_url())
        url = wizard.finish()
        wizard.reset()
        return HttpResponseRedirect(url)

    raise SuspiciousOperation()
