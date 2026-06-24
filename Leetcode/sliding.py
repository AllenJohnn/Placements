l=[1,2,1,3,4,5,6,6,6,1,3,4,6,6,3,2,1]
k=int(input("Enter The Number Of Books: "))
s=sum(l[:k])
m=s
for i in range(k,len(l)):
    s=s+l[i]-l[i-k]
    m=max(m,s)
print(m)