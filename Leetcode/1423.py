class Solution:
    def maxScore(self, cardPoints: List[int], k: int) -> int:
        n=len(cardPoints)
        s=sum(cardPoints[:k])
        m=s
        for i in range(k):
            s=s-cardPoints[k-1-i]+cardPoints[n-1-i]
            m=max(m,s)
        return m