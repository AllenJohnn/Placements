# class Solution:
#     def missingNumber(self, nums: List[int]) -> int:
#         for i in range(len(nums)+1):
#             if i not in nums:
#                 return i
                
                
                
                
class Solution:
    def missingNumber(self, nums: List[int]) -> int:
        n=len(nums)
        s1=n*(n+1)//2
        s2=sum(nums)
        return s1-s2
                