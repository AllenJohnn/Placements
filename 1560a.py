t=int(input())
for i in range (t):
    n=int(input())
    i,k=1,0
    while 1:
        if i%3!=0 and i%10!=3:
            k+=1
            if k==n:
                print(i)
                break
        i+=1                                                  