class Solution:
    def search(self, nums: List[int], target: int) -> int:
        res=[-1,-1]
        s,e=0,len(nums)-1
        while s<=e:
            m=(s+e)//2
            if nums[m]==target:
                res[0]=m
                e=m-1
            elif nums[m]<target:
                s=m+1
            else:
                e=m-1