# Watchpoints in gdb: wake me up when foo changes

@meta publishDatetime 2013-06-25T09:00:00.000+02:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2013/06/watchpoints-in-gdb-wake-me-up-when-foo.html

I've noticed a lot of people claim gdb is not a good debugger because it doesn't support feature X. X is many times the ability to monitor changes to a memory location (ie when the value of a variable changes). Most times, though, people believe gdb doesn't implement X only because not enough time was spent reading its manual.

In gdb it's very easy to monitor variable changes using watchpoints. Here's a very simple example session:

```
(gdb) list
1	int main()
2	{
3	    int a = 1;
4	    int b;
5	    a = b;
6	    b = 42;
7	    return 0;
8	}
```

Of course we need to be in the proper scope to set a watchpoint:

```
(gdb) run
Breakpoint 1, main () at test.cpp:3
```

Let's try to catch when b changes value:

```
(gdb) watch b
Hardware watchpoint 2: b
```

Interesting: a hardware watchpoint was set. What might that be?

```
(gdb) continue
Hardware watchpoint 2: b
  Old value = 0
  New value = 42
main () at test.cpp:7
```

Nice! gdb alerted us of the value change by breaking program execution. This can come in handy to fix race conditions.

Hardware and software watchpoints
---------------------------------

Gdb will use hardware watchpoints if the underlying platform provides them; that means your architecture should provide some kind of hook for gdb to be alerted when a memory write at a certain address occurs. Hardware watchpoints are quite easy to use, relatively speaking, but not all platforms support them. In that case gdb will use software watchpoints, which are quite expensive and slow. Did you ever try to run a program by pressing "step" continuously? Well, a software watchpoint is similar, gdb will have to execute a program step by step and check if the value has changed in between steps.

As usual, [gdb's manual](http://sourceware.org/gdb/current/onlinedocs/gdbint/Algorithms.html#Algorithms) has a lot more info.

PS: Once you find your bug with the aid of a watchpoint, please go and read some books about encapsulation!


---
## In reply to [this post](), [Automagically setup breakpoints with gdb | An infinite monkey - Nicolas Brailovsky&#39;s blog](/blog_md/2013/1105_Automagicallysetupbreakpointswithgdb.md) commented @ 2013-11-05T08:00:59.000+01:00:

[…] debugging session. This can be quite frustrating, when you have gdb workset full of breakpoints, watch expressions and all that […]

Original [published here](/blog_md/2013/0625_Watchpointsingdbwakemeupwhenfoochanges.md).

---
## In reply to [this post](), [Gdb hit count: ignoring breakpoints (for a while) | An infinite monkey - Nicolas Brailovsky&#39;s blog](/blog_md/2014/1118_Gdbhitcountignoringbreakpointsforawhile.md) commented @ 2014-11-18T13:24:38.000+01:00:

[…] way would be to set up a watch expression. If you can’t setup a watch expression, say, because you’re using an iterator and […]

Original [published here](/blog_md/2013/0625_Watchpointsingdbwakemeupwhenfoochanges.md).
