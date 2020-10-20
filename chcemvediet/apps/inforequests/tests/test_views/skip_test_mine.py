# vim: expandtab
# -*- coding: utf-8 -*-
from django.core.urlresolvers import reverse
from django.test import TestCase

from poleno.utils.test import ViewTestCaseMixin

from .. import InforequestsTestCaseMixin

class MineViewTest(InforequestsTestCaseMixin, ViewTestCaseMixin, TestCase):
    u"""
    Tests ``mine()`` view registered as "inforequests:mine".
    """

    def test_allowed_http_methods(self):
        allowed = [u'HEAD', u'GET']
        self.assert_allowed_http_methods(allowed, reverse(u'inforequests:mine'))

    def test_anonymous_user_is_redirected(self):
        self.assert_anonymous_user_is_redirected(reverse(u'inforequests:mine'))

    def test_authenticated_user_gets_inforequest_mine(self):
        self._login_user()
        response = self.client.get(reverse(u'inforequests:mine'))
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, u'inforequests/mine.html')

    def test_user_gets_only_his_inforequests_and_drafts(self):
        drafts1 = [self._create_inforequest_draft(applicant=self.user1) for i in range(5)]
        drafts2 = [self._create_inforequest_draft(applicant=self.user2) for i in range(3)]
        inforequests1 = [self._create_inforequest(applicant=self.user1) for i in range(4)]
        inforequests2 = [self._create_inforequest(applicant=self.user2) for i in range(5)]
        closed1 = [self._create_inforequest(applicant=self.user1, closed=True) for i in range(3)]
        closed2 = [self._create_inforequest(applicant=self.user2, closed=True) for i in range(3)]

        self._login_user(self.user1)
        response = self.client.get(reverse(u'inforequests:mine'))
        self.assertEqual(response.status_code, 200)
        self.assertItemsEqual(response.context[u'inforequests'], inforequests1)
        self.assertItemsEqual(response.context[u'drafts'], drafts1)
        self.assertItemsEqual(response.context[u'closed_inforequests'], closed1)

    def test_with_user_with_no_his_inforequests_nor_drafts(self):
        drafts2 = [self._create_inforequest_draft(applicant=self.user2) for i in range(3)]
        inforequests2 = [self._create_inforequest(applicant=self.user2) for i in range(5)]
        closed2 = [self._create_inforequest(applicant=self.user2, closed=True) for i in range(3)]

        self._login_user(self.user1)
        response = self.client.get(reverse(u'inforequests:mine'))
        self.assertEqual(response.status_code, 200)
        self.assertItemsEqual(response.context[u'inforequests'], [])
        self.assertItemsEqual(response.context[u'drafts'], [])
        self.assertItemsEqual(response.context[u'closed_inforequests'], [])

    def test_related_models_are_prefetched_before_render(self):
        drafts1 = [self._create_inforequest_draft(applicant=self.user1) for i in range(5)]
        inforequests1 = [self._create_inforequest(applicant=self.user1) for i in range(4)]
        closed1 = [self._create_inforequest(applicant=self.user1, closed=True) for i in range(3)]

        # Force view querysets to evaluate before calling render
        def pre_mock_render(request, temaplate, context):
            list(context[u'inforequests'])
            list(context[u'drafts'])
            list(context[u'closed_inforequests'])

        self._login_user(self.user1)
        with self.assertQueriesDuringRender([], pre_mock_render=pre_mock_render):
            response = self.client.get(reverse(u'inforequests:mine'))
        self.assertEqual(response.status_code, 200)
