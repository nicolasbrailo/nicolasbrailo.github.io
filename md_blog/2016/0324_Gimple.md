# Gimple

@meta publishDatetime 2016-03-24T21:07:00.000+01:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2016/03/gimple.html

Lately I've been toying around with gcc to learn a bit better how its optimization phases work. Understanding Gimple, the intermediate representation used by gcc, is a useful skill for this. Of course actually \*understanding\* it is quite an ambitious and daunting task, so it may be a bit more useful to skim through it.

Turns out that using -fdump-tree-all and -fdump-rtl-all its possible to get a lot of interesting information on the phases the compiler follows to get your code optimized, but the sheer amount of information produced makes it rather hard to make sense out of it. During the next few posts (weeks? months? probably until I satisfy my curiosity about gcc) I will be investigating a little bit the output of the -fdump options in gcc, to see what can be learned from it.

