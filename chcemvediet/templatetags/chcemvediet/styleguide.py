# vim: expandtab
# -*- coding: utf-8 -*-
import re

from django.contrib.staticfiles.finders import find as staticfiles_find

from poleno.utils.template import Library

register = Library()
sass_variable_re = re.compile(r'^([$][\w-]+):(.*)$')

@register.filter
def sass_variables(asset):
    res = {}
    path = staticfiles_find(asset)
    with open(path) as f:
        for line in f:
            match = sass_variable_re.match(line)
            if match:
                name = match.group(1).strip()
                value = match.group(2).strip()
                if value in res:
                    res[name] = res[value]
                else:
                    res[name] = value
    # Strip leading '$' and replace '-' with '_'
    for name, value in res.items():
        res[name.lstrip(u'$').replace(u'-', u'_')] = value
    return res
