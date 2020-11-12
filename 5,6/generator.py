class Generator:
    def __init__(self, lmb, p, rnd):
        self.lmb = lmb
        self.p = p
        self.rnd = rnd

    def generate(self):
        if self.rnd.random() < self.lmb:
            if self.rnd.random() < self.p:
                return 1
            else:
                return 2
        return 0
