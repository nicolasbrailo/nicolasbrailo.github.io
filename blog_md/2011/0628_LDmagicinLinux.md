# LD magic in Linux

@meta publishDatetime 2011-06-28T09:00:00.000+02:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2011/06/ld-magic-in-linux.html

The linker is a magical beast which does all sort of crazy stuff with your binaries, without you even knowing it. Every Linux install has a linker living in the shadows, though seeing it in action is a rare supernatural event. There is an ancient tradition to communicate with the spirit of your linker. Not many know about this secret dark path and it's powers to annoy even the most experienced (L)user.

You may begin your journey with the following enchanting:

```c++
export LD_DEBUG=help
```

If everything went fine nothing will seem to happen, yet if the gods of the console have heard you, the next time you try to run any binary at all you'll start to see the real magic. Try it, a simple "ls" will do the trick (don't use commands which are not binaries, like echo or export, these are "hardcoded" in bash, so to speak, and won't work since no runtime linking is necessary: they have already been linked when bash started!).

Read the help you just found. There is a lot of useful information there. Knowing the libs will give you an insight on the dependencies and the loading process of a binary. I have no idea what would be the use of knowing the files for each lib. The symbols and bindings are quite interesting, they remind me of an strace.

"all" is probably the best option to annoy a fellow programmer. Just set the env var and watch him go crazy.



# Comments

---
## In reply to [this post](), [Links 30/6/2011: Knoppix 2011 6.4, Netrunner 3.2 Released | Techrights](http://techrights.org/2011/06/30/netrunner-3-2-released/) commented @ 2011-06-30T09:54:08.000+02:00:

[...] LD magic in Linux The linker is a magical beast which does all sort of crazy stuff with your binaries, without you even knowing it. Every Linux install has a linker living in the shadows, though seeing it in action is a rare supernatural event. There is an ancient tradition to communicate with the spirit of your linker. Not many know about this secret dark path and it’s powers to annoy even the most experienced (L)user. [...]

Original [published here](/blog_md/2011/0628_LDmagicinLinux.md).
