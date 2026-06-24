class Solution:
    def numSubarrayProductLessThanK(self, nums: List[int], k: int) -> int:
        if k<=1:
            return 0
        l,r=0,0
        cnt,product=0,1
        while(r<len(nums)):
            product*=nums[r]
            while product>=k:
                product//=nums[l]
                l=l+1
            cnt+=r-l+1
            r+=1
        return cnt