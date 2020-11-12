class Handler:
    def __init__(self, m, rnd):
        self.m = m
        self.t_type = 0
        self.rnd = rnd

    def set_task(self, t_type):
        tmp = self.t_type
        self.t_type = t_type
        return tmp

    def handle(self):
        if self.t_type:
            if self.rnd.random() < self.m:
                tmp = self.t_type
                self.t_type = 0
                return tmp
        return 0

    def get_state(self):
        return str(self.t_type)
