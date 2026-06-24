# ph=input()
# for i in ph:
#     print(i,ph.count(i))
    
    
# using hash table   
# l=[6,2,8,2,0,9,1,4,6,9]
# hash=[0]*10
# for i in l:
#     hash[i]+=1
# print(hash)


# no of occurence
# l=[6,2,8,2,0,9,1,4,6,9]
# d={}
# for i in l:
#     if i in d:
#         d[i]+=1
#     else:
#         d[i]=1
# print(d)



# l=[6,2,8,2,0,9,1,4,6,9]
# d={}
# for i in l:
#     if i in d:
#         d[i]+=1
#     else:
#         d[i]=1
# max,ele=0,0
# for i in d:
#     if d[i]>max:
#         max=d[i]
#         ele=i
# print(ele)



l=input()
d={}
for i in l:
    if i in d:
        d[i]+=1
    else:
        d[i]=1
max1,max2,ele1,ele2=0,0,0,0
for i in d:
    if d[i]>max1:
        max2=max1
        ele2=ele1
        max1=d[i]
        ele=i
    elif d[i]>max2:
        max2=d[i]
        ele2=i
print(ele2)
