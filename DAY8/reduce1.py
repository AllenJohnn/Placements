def fun(n):
    if n==1:
        return 0
    elif n%2==0:
        return 1+fun(n//2)
    else:
        return 1+min(fun(n-1),fun(n+1))
    
n=14
print(fun(n))


                #     15
                #   /    \
                # 16      14
                #  |       |
                #  8       7
                #  |     /   \
                #  4    8     6
                #  |    |     |
                #  2    4     3
                #  |    |   /   \
                #  1    2  4     2
                #       |  |     |
                #       1  2     1
                #          |
                #          1
                         