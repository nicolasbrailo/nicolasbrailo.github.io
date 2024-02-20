# Have you checked your stack?

@meta publishDatetime 2013-10-29T08:00:00.000+01:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2013/10/have-you-checked-your-stack.html

While getting bitten by running out of stack space is not a common thing, it sure is painful to debug. Unless it's caused by a (very obvious) stack overflow you will usually just get an unrelated segmentation fault in a seemingly random place, and not much help to troubleshoot the problem.

Luckily gcc seems to have an option to verify that your functions do not use an unbounded amount of stack space: just compile with the option "-fstack-usage" and a file .su will be generated with stack information for each function.

You probably want to see only static or bounded stack usages; an unbounded stack usage might be a sign that you should be storing that object on the stack instead.

