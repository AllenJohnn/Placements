l=[[1,2,3],
   [4,5,6],
   [7,8,9]]
k=8
flag=0
for i in range(len(l)):
    for j in range(len(l[0])):
        if l[i][j]==k:
            print(True)
            flag=1
            break
    if flag==0:
        print("False")