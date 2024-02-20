# My own gdb cheatsheet, just because

@meta publishDatetime 2013-07-04T09:00:00.000+02:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2013/07/my-own-gdb-cheatsheet-just-because.html

Gdb is the de facto tool for debugging applications on GNU/Linux. The first time you see it, it would appear to be a very simple application with very limited capabilities. Truth is, gdb is a very complex tool for a very difficult job, and becoming an proficient user can be a daunting task. To top it off, gdb graphical interfaces don't help at all when using it, so you are better off learning how to use it in console mode.

There are a ton of guides to learn the basics of gdb, so I'll just leave here a very quick list on the very basics needed to start understanding it:

### Running stuff

* Start your debugging session with "gdb $path\_to\_app"
* If you have a core dump you need to analyze, start it as "gdb $path\_to\_app $path\_to\_core"
* Don't forget to 'ulimit -c unlimited' if you want to get core files
* Don't forget to compile with debug symbols ("-g3")
* Are you using gcc? Then instead of -g3 use -ggdb

### Breaking stuff

* Set breakpoints by typing "break"
* Break on functions by typing "break 'Namespace::Class::InnerClass::function(overload\_t)'"
* When breaking on function's names, use tab's autocompletion. It's your best friend (don't forget the quotes in the function's name, otherwise the double colon symbol will break the autocompletion)
* You can also "break filename.cpp:line\_number"
* Start the show by typing "run"

### Viewing the source

* "list" will show the source code for your current location
* "list foo" will show the source code for function foo
* "list \*0x080483c7" will list the source code for whatever there is at address 0x080483c7
* Replace list for disassemble for extra fun
* "disassemble /r ..." will additionally print an hex dump
* "disassemble /m ..." will also interleave the original source

### While running

* step will continue execution until next line
* stepi will continue execution until next assembly instruction
* next will continue execution until next line, skipping function calls (ie won't step into another function)
* continue will run until the next breakpoint

### Inspecting stuff

* 'print x' will print an expression. You can print pretty much any valid c/c++ expression.
* "print \*0x080483b4" will print whatever there is at 0x080483b4
* "info locals" will print local vars
* "info registers" will print cool stuff
* "backtrace", bt for his friends, will print the current calling stack.

This cheatsheet is far from being "advanced stuff" but it should be enough to get you started. The rest is practice.


# Comments

---
## In reply to [this post](), [Automagically setup breakpoints with gdb | An infinite monkey - Nicolas Brailovsky&#39;s blog](/md_blog/2013/1105_Automagicallysetupbreakpointswithgdb.md) commented @ 2013-11-05T08:00:56.000+01:00:

[…] then restarting your debugging session. This can be quite frustrating, when you have gdb workset full of breakpoints, watch expressions and all that […]

Original [published here](/md_blog/2013/0704_Myowngdbcheatsheetjustbecause.md).
