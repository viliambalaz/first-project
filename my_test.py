import unittest
from unittest import skip

class TestStringMethods(unittest.TestCase):

    def test_upper(self):
        self.assertEqual('foo'.upper(), 'FOO')

    def test_isupper(self):
        self.assertTrue('FOO'.isupper())
        self.assertFalse('Foo'.isupper())

    def test_split(self):
        s = 'hello world'
        self.assertEqual(s.split(), ['hello', 'world'])
        # check that s.split fails when the separator is not a string
        with self.assertRaises(TypeError):
            s.split(2)
    
    #@unittest.skip("skip test")
    def test_correct(self):
        self.assertEqual('foo', 'boo')

    #@unittest.skip("skip test")
    def test_assert(self):
        assert False
        
    #@unittest.skip("skip test")
    def test_assert2(self):
        assert False

