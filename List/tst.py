l=list(map(int,input().split()))
print(l)
removed=[]
for i in l:
    if i not in removed:
        removed.append(i)
print(removed)