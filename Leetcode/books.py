l=[1,2,1,3,4,5,6,6,6,1,3,4,6,6,3,2,1]
k=int(input("Enter The Number Of Books: "))
m=0
for i in range(len(l)-k+1):
    s=0
    for j in range(i,i+k):
        s=s+l[j]
    m=max(m,s)
print(m)