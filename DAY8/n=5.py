def alen(n):
    if n>5:
        return True
    else:
        print(n, end='')
        alen(n+1)
alen(1)      


