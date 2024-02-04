# Running commands on Windows from Linux, through ssh

@meta publishDatetime 2011-09-22T09:00:00.000+02:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2011/09/running-commands-on-windows-from-linux.html

Running Windows is something I don't usually like (running of Windows is a different story) but having to run something on Windows command line interface is something I wouldn't wish even to my worst enemies. I was stuck in that situation, don't remember why, but I needed to run a command in a Windows machine, automatically, and I only had ssh (is there a better way of automating scripted tasks in Windows, remotely and without a GUI?). Well, this is what I came up with:

```c++
ssh host cmd /c dir
```

Running that in a bash shell will show the directory listing of C: in machine "host". Ugly as hell, but it's a good way of kickstarting a batch script.


# Comments

---
## In reply to [this post](), [Links 24/9/2011: Linux 3.1 RC7, Plasma Active OS | Techrights](http://techrights.org/2011/09/24/plasma-active-os/) commented @ 2011-09-24T15:51:12.000+02:00:

[...] Running commands on Windows from Linux, through ssh [...]

Original [published here](/blog_md/2011/0922_RunningcommandsonWindowsfromLinuxthroughssh.md).
