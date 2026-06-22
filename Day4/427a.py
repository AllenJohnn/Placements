n=int(input())
event=list(map(int,input().split()))
police,unsolved=0,0
for e in event:
    if e==-1:
        if police>0:
            police-=1
        else:
            unsolved+=1
    else:
        police+=e
print(unsolved)        
