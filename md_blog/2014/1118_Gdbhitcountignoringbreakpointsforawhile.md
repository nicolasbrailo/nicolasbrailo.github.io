# Gdb hit count: ignoring breakpoints (for a while)

@meta publishDatetime 2014-11-18T13:22:00.000+01:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2014/11/gdb-hit-count-ignoring-breakpoints-for.html

Some times a breakpoint is not enough; if you have a crash inside a loop, the object that makes your code crash might be in the 526th iteration. How can you debug this problem?

One way would be to set up a [watch expression](md_blog/2013/0625_Watchpointsingdbwakemeupwhenfoochanges.md). If you can't setup a watch expression, say, because you're using an iterator and it'd be hard to set one, you can also tell gdb to setup a breakpoint, and then ignore it N times.

Let's see how this works with this example:

```c++

#include <vector>

int main() {
    std::vector<int> v = {1,2,3,4,5,0,7,8,9};
    int x = 42;

    for (auto i = v.begin(); i != v.end(); ++i) {
        x = x / *i;
    }

    return 0;
}
```

After compiling we run it to see it crash; let's start it on gdb, then set a brakepoint on the line where it crashes.


```c++

(gdb) break foo.cpp:8
Breakpoint 1 at 0x4007bc: file foo.cpp, line 8.

(gdb) info breakpoints
Num     Type           Disp Enb Address            What
1       breakpoint     keep y   0x00000000004007bc in main() at foo.cpp:8

```

Typing "info breakpoints" will tell you the breakpoint number; then we can tell gdb to ignore this breakpoint forever (where forever is a very large number, so the program will run until it crashes):

```c++
(gdb) ignore 1 99999
Will ignore next 99999 crossings of breakpoint 1.
(gdb) run
Starting program: /home/nico/src/a.out

Program received signal SIGFPE, Arithmetic exception.
0x00000000004007d5 in main () at foo.cpp:8
8            x = x / *i;
(gdb) info breakpoints
Num     Type           Disp Enb Address            What
1       breakpoint     keep y   0x00000000004007bc in main() at foo.cpp:8
    breakpoint already hit 6 times
    ignore next 99993 hits
(gdb)
```

By doing this now we know the program crashes the sixth time it goes through that breakpoint. Now we can actually debug the problem:

```c++
(gdb) ignore 1 5
Will ignore next 5 crossings of breakpoint 1.
(gdb) run
Starting program: /home/nico/src/a.out

Breakpoint 1, main () at foo.cpp:8
8            x = x / *i;
(gdb) p *i
$1 = (int &) @0x603024: 0
```

This time gdb will break exactly on the spot we want.


# Comments

---
## In reply to this post, [Antiskeptic (@notthatsid)](md_blog/youfoundadeadlink.md) commented @ 2015-03-26T11:23:21.000+01:00:

Why not use a print i command when you get the exception? Will it not tell you the iteration? I like your hack, but I want to know if this solution is the only way for your example.

Original [published here](md_blog/2014/1118_Gdbhitcountignoringbreakpointsforawhile.md).

---
## In reply to this post, [nico](md_blog/aboutme.md) commented @ 2015-03-26T11:37:20.000+01:00:

Hi Antiskeptic, for the first part of the article, you can indeed simply `print i` to know which iteration is triggering the bug. That should work just as fine as ignoring it forever and then checking the count in gdb, or writing `cout << i` in the loop.

For the second part of the article, you still need to use the ignore command. If you want to debug the problem by setting a breakpoint, and only have it trigger in the Nth iteration of the loop, I can't really think of any other ways than setting a (possible complicated) watch expression or using the ignore command. There may be and I'm just not being imaginative enough. C++ is an amazing stack that way, people can come up with very creative solutions to all kinds of problems.

Original [published here](md_blog/2014/1118_Gdbhitcountignoringbreakpointsforawhile.md).
