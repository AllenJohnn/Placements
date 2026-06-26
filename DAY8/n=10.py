def alen(n):
    if n<2:
        return True
    else:
        print(n,end=' ')
        alen(n-2)       
        if n!=2:
            print(n, end=' ')
alen(10)
