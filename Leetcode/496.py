class Solution:
    def nextGreaterElement(self, nums1: List[int], nums2: List[int]) -> List[int]:
        stack = []
        d = {}

        for curr in nums2:
            while stack and stack[-1] < curr:
                d[stack.pop()] = curr
            stack.append(curr)

        while stack:
            d[stack.pop()] = -1

        res = []
        for i in nums1:
            res.append(d[i])

        return res