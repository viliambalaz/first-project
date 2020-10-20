class A(object):
    def __init__(self):
        self.a = 'a'
        print 'A class'

class B(A):
    def __init__(self):
        super(B, self).__init__()
        self.b = 'b'
        print 'B class'

class C(B, A):
    def __init__(self):
        super(B, self).__init__()
        self.c = 'c'
        print 'C class'



c = C()
print vars(c)