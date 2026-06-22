class Solution:
    def lemonadeChange(self, bills: List[int]) -> bool:
        five,ten=0,0
        for c in bills:
            if c==5:
                five+=1
            elif c==10:
                if five>0:
                    five-=1
                else:
                    return False
            else:
                if five>0 and ten>0:
                    five-=1
                    ten-=1
                elif five>=3:
                    five-=3
                else:
                    return False

        else:
            return True
            