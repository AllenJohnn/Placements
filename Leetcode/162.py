class Solution:
    def findPeakElement(self, nums: List[int]) -> int:
        n=len(nums)-1
        if n==0:
            return 0
        elif nums[0]>nums[1]:
            return 0
        elif nums[n]>nums[n-1]:
            return n
        s,e=0,n
        while s<=e:
            m=(s+e)//2
            if nums[m-1]<nums[m]>nums[m+1]:
                return m
            elif nums[m]<nums[m+1]:
                s=m+1
            else:
                e=m-1