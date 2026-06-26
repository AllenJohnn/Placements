# def fun(n):
#     if n==0:
#         return 200
#     fun(n-1)
#     print(n, end=" ")
    
# n=5
# print(fun(n))



def fun(n):
    if n == 0:
        return 200
    x = fun(n-1)
    print(n, end=" ")
    return x

n=5
print(fun(n))