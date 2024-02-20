# A tardis in gdb? Reverse a program's execution!

@meta publishDatetime 2013-07-02T09:00:00.000+02:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2013/07/a-tardis-in-gdb-reverse-program.html

Have you ever been running a long debug session only to find you missed the spot by overstepping? I sure have and that can be one of the strongest motivators to invent a time machine. And it seems I'm not the only one who thinks so, given that gdb can now travel back in time. That's right, you can save a snapshot of a running program and then reverse the polarity to go back in time, just before you missed your breakpoint!

It's very simple to use too, you don't need six people to use this feature. Just type "checkpoint" in gdb to let it know you want to record the execution's state, then "restore N" to go back in time. I've recorded a sample debugging session:

```c++
(gdb) list
1	int main()
2	{
3	    int a = 1;
4	    int b =2 ;
5	    a = b;
6	    b = 42;
7	    return 0;
8	}

(gdb) run
Breakpoint 1, main () at test.cpp:3
3	    int a = 1;
(gdb) n
4	    int b =2 ;
(gdb) p a
$1 = 1
```

Next, create a checkpoint:

```c++
(gdb) checkpoint
checkpoint: fork returned pid 29192.
```

Interesting: a checkpoint is actually implemented as a fork. Moving on:

```c++
(gdb) n
5	    a = b;
(gdb) n
6	    b = 42;
(gdb) p a
$2 = 2
```

Ohnoes! We overstepped. Let's go back:

```c++
(gdb) restart 1
Switching to process 29192
#0  main () at test.cpp:4
4	    int b =2 ;
(gdb) p a
$3 = 1
```

And we're back in time.

How does it work
----------------

Reversing to a previous execution state is not an easy task. Gdb implements this feature by forking out a new process, a process we can later switch to. This means that reverting to a previous state might break things. The way forking is implemented in Linux, things like open files shouldn't be much of a problem. Sockets should still be connected but, of course, whatever you already sent won't be "unsent".

[Gdb internals docs](http://sourceware.org/gdb/current/onlinedocs/gdbint/Algorithms.html#Algorithms) have some useful information on the limitation of this feature.

