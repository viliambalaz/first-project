# This file was autogenerated by `setup.py`. Do NOT edit it.
execfile(os.path.join(SETTINGS_PATH, u'server_local.py'))
execfile(os.path.join(SETTINGS_PATH, u'mail_dummymail.py'))
MOCK_LIBREOFFICE = True
MOCK_IMAGEMAGIC = True
MOCK_OCR = True
SECRET_KEY = u'P=i(]5Cs/{&|%8;R[79h.p"3d8TNh.S55iC7kG/9+NHe9o0yu,Op%&Xga0Md"r>Nme#.iJ>}N(iZ=/H`i_6F5wD5x1y$!1k>MZqk'
ALLOWED_HOSTS = [u'.localhost']
SERVER_EMAIL = u'admin@localhost'
ADMINS[len(ADMINS):] = [(u'Admin', u'admin@localhost')]
SUPPORT_EMAIL = u'info@localhost'
INFOREQUEST_UNIQUE_EMAIL = u'{token}@mail.localhost'
DEFAULT_FROM_EMAIL = u'info@localhost'
OBLIGEE_DUMMY_MAIL = u'obilgee@chcemvediet.sk'
DEVBAR_MESSAGE = u''
CACHES[u"default"][u"KEY_PREFIX"] = u'www-chcemvediet-sk'
CACHES[u"default"][u"VERSION"] = 5
SEARCH_API_KEY = u''
