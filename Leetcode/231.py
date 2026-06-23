class Solution:
    def isPowerOfTwo(self, n: int) -> bool:
        if n<1:
            return False
        if n&(n-1)==0:
            return True
        else:
            return False
        