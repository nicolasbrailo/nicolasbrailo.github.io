# Debugging multiple processes with gdb

@meta publishDatetime 2015-06-09T09:00:00.000+02:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2015/06/debugging-multiple-processes-with-gdb.html

If your buggy program generates lots of child processes, gdb will keep attached to the parent program and let all the children run loose. If you're having problems to find what causes  your crash this is probably not what you want: for those occasions gdb has a very helpful flag called detach on fork.

With [detach on fork](https://sourceware.org/gdb/onlinedocs/gdb/Forks.html) you can tell gdb to keep debugging the parent, follow the children, or keep track of all processes. Must be nice to troubleshoot forkbombs with this option.

