n=int(input())
floors=list(map(int,input().split()))
count=0
max=0
for f in floors:
    if f > max:
        max+=1
        count+=1
