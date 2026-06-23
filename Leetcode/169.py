#if the current element and the canditate is different reduce the vote by 1
#if vote is 0 assign the current element to the candidate   

class Solution:
    def majorityElement(self, nums: List[int]) -> int:
        c=nums[0]
        vote=0
        for curr in nums:
            if vote==0:
                c=curr
            if curr==c:
                vote+=1
            else:
                vote-=1
        return c        