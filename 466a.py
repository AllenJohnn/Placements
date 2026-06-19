n,m,a,b=(int,input().split())
if a*m<b:
    print(a*n)
else:
    metrocard_cost=(n//m)*b
    restday_cost=min(b,(n%m*a))
    total=metrocard_cost+restday_cost
    
    print(total)    