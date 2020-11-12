from model import Model


if __name__ == '__main__':
    model = Model(n=5_000_000, lmb=0.9, m=0.5, p=0.3)
    model.simulate()
