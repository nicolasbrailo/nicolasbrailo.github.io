# Oh shit, the stack

@meta publishDatetime 2010-06-01T09:00:00.000+02:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2010/06/oh-shit-stack.html

Post from the wayback machine. I wrote this a long time ago but it got way down the posts queue, don't know why

I liked my vacations very much, thank you. Some people enjoyed vacations from me too. At work they even decided to keep this gem for my return. Upon my arrival a nice coredump was waiting at my desk, so to speak. Check it out, isn't it beautiful?

```c++
0 0xff05d070 in inflate_fast () from /usr/lib/libz.so
1 0xff05a13c in inflate () from /usr/lib/libz.so
2 0x00146224 in ZDecompress::decompress (this=0xfbc7b300, sauce=@0xfbe7b740, dest=@0x27c910) at Compressor.h:134
3 0x00145e80 in HandleClient::get_client_data (this=0x27c810, output_stream=0x27c910) at IPC/DataReceiver.cpp:54
```

Yeah, that's getting killed inside zlib. Nice way to start the year, a bug in zlib. What led me to that conclusion? Easy, the same compressed file worked in Ubuntu. Must be a bug in zlib then!

The next step was getting zlib's code and adding enough printf's to know the problem was in the middle of the file, not at the beginning nor the end; indeed, most of the file could be correctly decoded, but then it just died. This looked more and more like a bug in zlib.

I began to scramble things around, trying to isolate the problem. Things just got weirder, the same code worked fine if instead of being inside a thread I was on the main thread. If you have psychic powers you now have enough information to know what the problem was. Although I should have known too (this wasn't even the first time I saw a problem like this one!) I was mindset on finding a bug in zlib, which now, it seems, only appears while interacting with ACE (in my defence, I did see these kind of bugs too).

Fiddling around with the code some more, even stranger backtraces began to appear. First this one:

```c++
Program received signal SIGSEGV, Segmentation fault.
[Switching to LWP 10]
0xfd6b88fc in _pollsys () from /usr/lib/libc.so.1
(gdb) bt
#0  0xfd6b88fc in _pollsys () from /usr/lib/libc.so.1
#1  0x696e7661 in ?? ()
#2  0x696e7661 in ?? ()
```

And then this other one, which led me into the right direction:

```c++
Program received signal SIGSEGV, Segmentation fault.
[Switching to LWP 9]
0x000b6784 in std::operator| (__a=Cannot access memory at address 0xfbb7b094
)
    at /usr/local/lib/gcc/sparc-sun-solaris2.10/3.4.6/../../../../include/c++/3.4.6/bits/ios_base.h:124
124       { return _Ios_Openmode(static_cast(__a) | static_cast(__b)); }
(gdb) bt
#0  0x000b6784 in std::operator| (__a=Cannot access memory at address 0xfbb7b094
)
    at /usr/local/lib/gcc/sparc-sun-solaris2.10/3.4.6/../../../../include/c++/3.4.6/bits/ios_base.h:124
#1  0x00152d5c in HandleClient::get_client_data (this=Cannot access memory at address 0xfbb7b088
) at IPC/DataReceiver.cpp:46
```

That last stack trace got me to think how could it be possible for an otherwise working program to coredump while creating an stdlib object. I mean, stdlib is quite well tested, isn't it? Then it struck me: the keyword isn't stdlib but **creating**. It was allocating memory from the stack, upon entering the function.

Some more research later I found out that Solaris default thread size is about 1 mb, while in Ubuntu this thread is of about 8 mb. And I also noticed the buffer I was allocating for zlib was taking up space in... the stack.

If there's something to learn from this story is that you should always know what goes in the stack: only small objects should live there, and you should always know the max stack depth a function could reach. Otherwise it may come back and bite you in the ass when you're back from your vacations.


---
## In reply to [this post](), [Jason]() commented @ 2010-06-22T17:45:48.000+02:00:

Thanks for this post. As soon as I saw the title in Google I clued in to what I'd done :)

Original [published here](/md_blog/2010/0601_Ohshitthestack.md).

---
## In reply to [this post](), [nico](/md_blog/youfoundadeadlink.md) commented @ 2010-06-22T17:50:22.000+02:00:

I'm glad to know I'm not the only one who finds (and makes) these kind of bugs lol

Original [published here](/md_blog/2010/0601_Ohshitthestack.md).
