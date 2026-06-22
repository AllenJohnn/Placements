why index starts from 0 not 1 in list

base add + offset * size of datatype




in array elements are kept in a sequential manner

but in list the reference id is kept in a sequential manner

methods ti create a list

Hard code
l=[1,True,"Sash",3.14]
print(l)

Using Split
l=input("Enter The List: ").split()
print(l)

Map For A Specific Data Type
l=list(map(int,input("Enter The List: ").split()))
print(l)

3 methods to add elements in a list

1. append

l=[1,2,3]
l.append(4)
print(l)

2. extend

l=[1,2,3]
l.extend([4,5])
print(l)

3. insert

l=[1,2,3]
l.insert(1,4)
print(l)

3 methods to delete elements in a list

1. pop

l=[1,2,3]
l.pop()
print(l)

2. remove

l=[1,2,3]
l.remove(2)
print(l)

3. clear

l=[1,2,3]   
l.clear()
print(l)

sort a list

l=[5,4,8,2,7]
l.sort()
print(l)

reverse a list

l=[5,4,8,2,7]
l.reverse()
print(l)

count a list

l=[5,4,8,2,7,5,5]
l.count(5)
print(l)

index a list

l=[5,4,8,2,7,5,5]
l.index(5)
print(l)

copy a list

l=[5,4,8,2,7,5,5]
l1=l.copy()
print(l1)


slicing a list

l=[5,4,8,2,7,5,5]
l1=l[1:4]
print(l1)

to run a loop from backward

for i in reversed(l):
    print(i)