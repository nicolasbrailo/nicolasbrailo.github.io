# Don't exit gdb just to run make!

@meta publishDatetime 2016-02-02T08:00:00.000+01:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2016/02/don-exit-gdb-just-to-run-make.html

f you're more or less successful in your debugging session, it's quite likely that you'll have to modify some source code so you can actually fix a bug. And if you're more or less careful, you might want to validate your changes actually work. We saw some time ago that you don't need to restart gdb after a recompile because gdb is already smart enough to know that the binary changed.

Turns out you don't even need to drop from gdb to a shell: just type make (using the parameters you'd usually call make with) and watch gdb take care of building your binary again.

Rebuilding your project like this is not only useful to save time: you can also keep your breakpoints and they should still make sense, assuming you didn't refactor your code too much.

