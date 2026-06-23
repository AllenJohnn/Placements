class Solution:
    def plusOne(self, digits: List[int]) -> List[int]:
        l2=[]
        x=""
        for i in digits:
            x+=str(i)
        y=int(x)+1
        for i in f"{y}":
            l2.append(int(i))
        return(l2)