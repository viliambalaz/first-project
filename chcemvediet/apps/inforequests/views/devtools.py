# vim: expandtab
# -*- coding: utf-8 -*-
import datetime

from django.conf import settings
from django.db import transaction
from django.db.models import F
from django.views.decorators.http import require_http_methods
from django.http import HttpResponseRedirect
from django.contrib import messages

from poleno.mail.models import Message, Recipient
from poleno.utils.urls import reverse
from poleno.utils.views import login_required
from chcemvediet.apps.inforequests.models import Inforequest, Action


@require_http_methods([u'POST'])
@transaction.atomic
@login_required
def devtools_mock_response(request, inforequest_pk):
    assert settings.DEBUG

    inforequest = Inforequest.objects.owned_by(request.user).get_or_404(pk=inforequest_pk)
    outbound = inforequest.email_set.outbound().order_by_processed().last()
    sender = outbound.recipient_set.first() if outbound else None
    address = ((sender.name, sender.mail) if sender
            else inforequest.main_branch.obligee.emails_parsed[0])
    subject = u'Re: ' + outbound.subject if outbound else u'Mock Response'
    content = request.POST.get(u'content', None) or u'Mock Response'

    email = Message.objects.create(
            type=Message.TYPES.INBOUND,
            processed=None,
            from_name=address[0],
            from_mail=address[1],
            subject=subject,
            text=content,
            )
    recipient = Recipient.objects.create(
            message=email,
            name=inforequest.applicant.get_full_name(),
            mail=inforequest.unique_email,
            type=Recipient.TYPES.TO,
            status=Recipient.STATUSES.INBOUND,
            )

    messages.success(request,
            u'Mock obligee response queued. It will be processed in a minute or two.')
    return HttpResponseRedirect(inforequest.get_absolute_url())

@require_http_methods([u'POST'])
@transaction.atomic
@login_required
def devtools_undo_last_action(request, inforequest_pk):
    assert settings.DEBUG

    inforequest = Inforequest.objects.owned_by(request.user).get_or_404(pk=inforequest_pk)
    branch = inforequest.branch_set.get_or_404(pk=request.POST.get(u'branch'))

    if branch.last_action.type == Action.TYPES.REQUEST:
        messages.error(request, u'Nothing deleted, the branch contains only a request.')
    elif branch.last_action.type == Action.TYPES.ADVANCED_REQUEST:
        messages.error(request, u'Nothing deleted, the branch contains only an advanced request.')
    else:
        branch.last_action.delete()
        messages.success(request, u'The last action, {0}, of branch {1} to {2} was deleted.'.format(
            branch.last_action.get_type_display(), branch.pk, branch.historicalobligee.name))

    return HttpResponseRedirect(inforequest.get_absolute_url())

@require_http_methods([u'POST'])
@transaction.atomic
@login_required
def devtools_push_history(request, inforequest_pk):
    assert settings.DEBUG

    inforequest = Inforequest.objects.owned_by(request.user).get_or_404(pk=inforequest_pk)

    try:
        days = int(request.POST[u'days'])
    except (KeyError, ValueError):
        days = 0

    if days >= -200 and days <= 200:
        delta = datetime.timedelta(days=days)
        Inforequest.objects.filter(pk=inforequest.pk).update(
                submission_date=F(u'submission_date') - delta,
                last_undecided_email_reminder=F(u'last_undecided_email_reminder') - delta,
                )
        inforequest.email_set.all().update(
                created=F(u'created') - delta,
                processed=F(u'processed') - delta,
                )
        Action.objects.filter(branch__inforequest=inforequest).update(
                created=F(u'created') - delta,
                sent_date=F(u'sent_date') - delta,
                delivered_date=F(u'delivered_date') - delta,
                legal_date=F(u'legal_date') - delta,
                snooze=F(u'snooze') - delta,
                last_deadline_reminder=F(u'last_deadline_reminder') - delta,
                )
        messages.success(request,
                u'The inforequest was pushed in history by {} days.'.format(days))
    else:
        messages.error(request, u'Invalid number of days.')

    return HttpResponseRedirect(inforequest.get_absolute_url())

@require_http_methods([u'POST'])
@transaction.atomic
@login_required
def devtools_delete(request, inforequest_pk):
    assert settings.DEBUG

    inforequest = Inforequest.objects.owned_by(request.user).get_or_404(pk=inforequest_pk)
    inforequest.delete()

    return HttpResponseRedirect(reverse(u'inforequests:mine'))
