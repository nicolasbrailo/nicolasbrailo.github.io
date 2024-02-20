# Ageing Stack overflow?

@meta publishDatetime 2016-11-15T08:00:00.000+01:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2016/11/ageing-stack-overflow.html

Hacking away on a little side project of mine, I found myself checking Stack Overflow for implementation tips about things I don't usually work with. Android UI stuff, mostly, which apparently is a very dynamic and ever changing ecosystem. After more than a few wasted hours, I noticed a worrying trend: in SO, answers tend to age horribly. If you are looking for "How to do X in platform Y", you may find a 4 year old answer that solves the problem, but only for platform Y, version "ancient".

Information ageing is quite a problem on its own. The answer is still valid, and, for people working on that specific platform, probably relevant. This will make it the first answer, leaving a lot of people (like myself) frustrated because the solution won't work in newer platforms. Is there a solution? Implement some kind of ageing time-window for information? Make the date a more prominent search parameter? Explicitly specify your platform and environment's version when asking a question? I have no idea.

While Stack Overflow seems to exacerbate the issue, this is a problem even for products with a company actively maintaining their documentation. A very annoying example; looking for ways to manage the media key I ended up in a [page](https://developer.android.com/training/managing-audio/volume-playback.html) which (as of August 2016) points to a very outdated API (registerMediaButtonEventReceiver, in case you are wondering). If even Google encounters problems when managing documentation ageing for their own products, what can we expect of people like us, who only have a tiny fraction of that budget?

/Rant

