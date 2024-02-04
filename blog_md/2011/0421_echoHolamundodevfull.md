# echo "Hola mundo" > /dev/full

@meta publishDatetime 2011-04-21T09:00:00.000+02:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2011/04/echo-mundo-devfull.html

I'd write something witty but there's not a lot to talk about /dev/full. Anyway, it is a cool tip, so I'll share it:

> Everyone knows /dev/null, and most will know /dev/zero. But /dev/full was unknown to me until some time ago. This device will respond to any write request with ENOSPC, No space left on device. Handy if you want to test if your program catches "disk full" - just let it write there

From [Myon's Blog](http://www.df7cb.de/blog/2010/dev_full.html)

