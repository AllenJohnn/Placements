class Solution:
    def isValid(self, s: str) -> bool:
        stack=[]
        for i in s:
            if i == '(' or '{' or '[' :
                stack.append(s)
            else:
                if len(stack)==0:
                    return False
                elif i == ')':
                    return True
                elif i == '}':
                    return True
                elif i == ']':
                    return True