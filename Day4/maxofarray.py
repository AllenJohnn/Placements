# integer=list(map(int,input().split()))
# integer.sort()
# print(integer[-1])


integer=list(map(int,input().split()))
max1=0
max2=0
for i in integer:
    if i>max:
        max2=max1
        max=i
    elif i>max2 and i!=max1:
        max2=i
print(max2)