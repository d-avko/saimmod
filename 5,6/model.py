import random

from generator import Generator
from handler import Handler
from queue import Queue


DELTA_T = 0.001


class Model:
    def __init__(self, n, lmb, m, p):
        self.n = n
        self.lmb = lmb * DELTA_T
        self.m = m * DELTA_T
        self.p = p

        random.seed()
        rnd = random
        self.generator = Generator(self.lmb, self.p, rnd)
        self.handler = Handler(self.m, rnd)
        self.queue = Queue()

        self.state = {
            '00+0': 1,
            '00+1': 0,
            '01+1': 0,
            '11+1': 0,
            '00+2': 0,
            '02+2': 0,
            '22+2': 0,
            '22+1': 0,
            '21+1': 0,
            '02+1': 0,
        }

    def simulate(self):
        z1_count = 0
        z2_count = 0
        z1_rejected = 0
        z2_rejected = 0
        z1_handled = 0
        z2_handled = 0

        for _ in range(self.n):

            h_state = self.handler.get_state()
            q_state = self.queue.get_state()
            z = self.generator.generate()
            if z == 1:
                z1_count += 1
                if h_state == '0' or h_state == '2':
                    z_tmp = self.handler.set_task(z)
                    z_tmp = self.queue.enqueue(z_tmp)
                    if z_tmp:
                        z2_rejected += 1
                else:
                    z_tmp = self.queue.enqueue(z)
                    if z_tmp == 2:
                        z2_rejected += 1
                    elif z_tmp == 1:
                        z1_rejected += 1
            elif z == 2:
                z2_count += 1
                if h_state == '0':
                    self.handler.set_task(z)
                else:
                    z_tmp = self.queue.enqueue(z)
                    if z_tmp:
                        z2_rejected += 1

            h_state = self.handler.get_state()
            q_state = self.queue.get_state()
            z = self.handler.handle()
            if z == 1:
                z1_handled += 1
            elif z == 2:
                z2_handled += 1
            if z:
                if q_state != '00':
                    z = self.queue.dequeue()
                    self.handler.set_task(z)

            state = q_state + '+' + h_state
            self.state[state] += 1

        print('P00+0 = {}'.format(self.state['00+0'] / self.n))
        print('P00+1 = {}'.format(self.state['00+1'] / self.n))
        print('P01+1 = {}'.format(self.state['01+1'] / self.n))
        print('P11+1 = {}'.format(self.state['11+1'] / self.n))
        print('P00+2 = {}'.format(self.state['00+2'] / self.n))
        print('P02+2 = {}'.format(self.state['02+2'] / self.n))
        print('P22+2 = {}'.format(self.state['22+2'] / self.n))
        print('P22+1 = {}'.format(self.state['22+1'] / self.n))
        print('P21+1 = {}'.format(self.state['21+1'] / self.n))
        print('P02+1 = {}'.format(self.state['02+1'] / self.n))
        print()
        print('Q1 = {}'.format(1 - (z1_rejected / z1_count)))
        print('Q2 = {}'.format(1 - (z2_rejected / z2_count)))
        print('Q1 = {}'.format(z1_handled / z1_count))
        print('Q2 = {}'.format(z2_handled / z2_count))
