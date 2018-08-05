1. Integer Overflow and Underflow

I have implemented a modifier to make sure value sent in transaction is greater than or equal to issuing price. This will avoid an underflow error in the following instruction:

#msg.sender.transfer(msg.value - pricePerCertification);#

I couldn't identify other vulnerabilities such as:
* Race Conditions
* Transaction-Ordering Dependence (TOD) / Front Running
* Timestamp Dependence
* Integer Overflow and Underflow
* DoS with (Unexpected) revert
* DoS with Block Gas Limit
