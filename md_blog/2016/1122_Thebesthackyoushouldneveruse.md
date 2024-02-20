# The best hack you should never use

@meta publishDatetime 2016-11-22T08:00:00.000+01:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2016/11/the-best-hack-you-should-never-use.html

Please don't do this. But if you do: leave a comment here!

```c++
#define private public
#include "something"
#define private private
```

Found in some random project.

# Comments

---
## In reply to this post, [Tanzinul Islam]() commented @ 2016-11-28T06:53:49.000+01:00:

You also probably want to do: #define class struct

Original [published here](md_blog/2016/1122_Thebesthackyoushouldneveruse.md).

---
## In reply to this post, [nicolasbrailo](/md_blog) commented @ 2016-11-28T13:57:34.000+01:00:

Please don't. That's horrible :)
But, yes, you're correct: that'd be necessary to make this awful thing work. Thanks for the addition!

Original [published here](md_blog/2016/1122_Thebesthackyoushouldneveruse.md).
