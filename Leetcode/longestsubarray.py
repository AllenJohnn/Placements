arr=[5,1,4,6,2,1,3,3,7,8,1,3,3]
k=10
l,r,m,s=0,0,0,0
while r<len(arr):
    s+=arr[r]
    while s>k:
        s-=arr[l]
        l+=1
    length=r-l+1
    m=max(m,length)
    r+=1
print(m)