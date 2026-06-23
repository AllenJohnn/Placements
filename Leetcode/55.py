class Solution:
    def canJump(self, nums: List[int]) -> bool:
        petrol=0
        for p in nums:
            if petrol<0:
                return False
            elif p>petrol:
                petrol=p
            petrol-=1
        return True
        