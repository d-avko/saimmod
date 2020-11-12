class Queue:
    def __init__(self):
        self.t_type1 = 0
        self.t_type2 = 0

    def enqueue(self, t_type):
        if t_type < self.t_type1 or not self.t_type1:
            tmp = self.t_type1
            self.t_type1 = t_type
            tmp2 = self.t_type2
            self.t_type2 = tmp
            return tmp2
        elif t_type < self.t_type2 or not self.t_type2:
            tmp = self.t_type2
            self.t_type2 = t_type
            return tmp
        return t_type

    def dequeue(self):
        tmp = self.t_type1
        self.t_type1 = self.t_type2
        self.t_type2 = 0
        return tmp

    def get_state(self):
        return str(self.t_type2) + str(self.t_type1)
