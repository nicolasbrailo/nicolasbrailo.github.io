# gdb: debugging multithreaded applications

@meta publishDatetime 2009-10-01T09:00:00.000+02:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2009/10/gdb-debugging-multithreaded-applications.html

Few things look cooler than debugging a multithreaded application using [TUI](/blog_md/2009/0922_gdbgraphictuimode.md) through ssh on a client, halfway across the world. There you are, felling the geek of the century when all of the sudden gdb starts jumping from one thread to the other. OMFGBBQ! What are you going to do now?

The scheduler locking policy defines when will thread context swtiches occur. If you are debuging a thead and don't want to be bothered by another then just lock the scheduler.

gdb has a default scheduling locking which defaults to "most annoying", but fortunately you can easily change it:

set scheduler-locking

The possible values are:
* off: Disable locking, switches threads whenever gdb damn pleases
* on: Enable locking, won't (ever) switch threads. **Beware of deadlocks!**
* step: Disable locking while running only

Hopefully this will save you some time.

