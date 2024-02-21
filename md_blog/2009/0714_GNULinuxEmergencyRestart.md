# GNU/Linux: Emergency Restart

@meta publishDatetime 2009-07-14T10:00:00.000+02:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2009/07/gnulinux-emergency-restart.html

It happens: we're happily hacking on some code and out of nowhere X server freezes. It may be the latest Compiz whose at fault, or perhaps a stray program that decided it should start consuming all available CPU. Anyway, it's easier to reboot than trying to fix whatever got broken but Ctrl - Alt - Backspace is unresponsive and we can't drop to a console. It's not ussual but it happens. What can we do about it?

There's a cool shortcut to help us when shit happens, it'll reboot the computer and it's a little bit nicer than yanking out the power cord. You just need to remember REISUB and have some keyboard dexitry - holding down Ctrl - Alt - SysRQ/PrintScreen is required while typing REISUB (**don't do it now, it'll reboot your computer!**).

So, what's REISUB all about? It's a little bit better than a forced hard reboot because it'll:

1. R: Restore console
 - E: Send SIGTERM to all processes
 - I: Send SIGKILL to all processes
 - S: Emergency sync of all filesystems (commit any changes to the phisical media)
 - U: Read only remount of all filesystems
 - B: Reboot now

So, off course, you'll have to wait a little bit between every keystroke. Press Ctrl + Alt + PrntScreen + H on a console to get some help on every command.

### Why does it work?

There's a lot of magic involved to make this secret incantation work. It involves kernels, vectors and other mythical beasts. There's a crazy thing called interruption vector; it's the place where every (hardware) event gets dispatched to a handling function. There lives a function call to handle keyboard input, amongst other things. This function call will be executed always, though the SO may just decide to queue the keyboard input if it's too busy handling something else.

Well, this key combination can't be delayed 'till later, it must be handled NOW, therefore, even if there's a stray process or a driver gone mad, it'll always be caught and the computer will be rebooted.

What's the catch? You won't be saving that precious code you we're hacking away when it all started, but at least you'll save some fscking time on the next start up.


---
## In reply to this post, [Anonymous]() commented @ 2010-02-14T21:23:58.000+01:00:

Ctrl is not needed!

Original [published here](md_blog/2009/0714_GNULinuxEmergencyRestart.md).

---
## In reply to this post, [nico](md_blog/aboutme.md) commented @ 2010-02-14T22:45:17.000+01:00:

Really? All those years practicing yoga so I could reach that weird key combo, for nothing? Man, wish I knew that one sooner :)

Original [published here](md_blog/2009/0714_GNULinuxEmergencyRestart.md).

---
## In reply to this post, [Yuvi](md_blog/youfoundadeadlink.md) commented @ 2010-05-18T15:28:45.000+02:00:

I knew only about the B, thanks for the others.

And no, you don't have to press Ctrl :)

Original [published here](md_blog/2009/0714_GNULinuxEmergencyRestart.md).

---
## In reply to this post, [dsfadsfgafgf](md_blog/youfoundadeadlink.md) commented @ 2010-05-18T15:39:29.000+02:00:

I have to keep a finger on my laptops Fn key to do this. It's most annoying. Almost snaps my fingers.

Original [published here](md_blog/2009/0714_GNULinuxEmergencyRestart.md).

---
## In reply to this post, [thisisabore](md_blog/youfoundadeadlink.md) commented @ 2010-05-18T15:43:02.000+02:00:

RESIUB, also remembered with the nice-to-know “Raising Skinny Elephants Is Utterly Boring”.

RESIUO will Power-Off instead of rebooting, which might sometimes also be useful.

You'd be surprised how many kiosks running Linux don't have this sequence disabled…

Original [published here](md_blog/2009/0714_GNULinuxEmergencyRestart.md).

---
## In reply to this post, [Anonymous]() commented @ 2010-05-18T15:50:55.000+02:00:

that will not work with kernels where the magic sysrq feature is not enabled

Original [published here](md_blog/2009/0714_GNULinuxEmergencyRestart.md).

---
## In reply to this post, [nico](md_blog/aboutme.md) commented @ 2010-05-18T15:54:45.000+02:00:

> dsfadsfgafgf

Indeed. Luckly most laptops tend to have a smaller keyboard :)

> thisisabore

I'll have to try it next time I see one. There are not much of those over here, though. Most of the kiosks are Windows (it's fun to see the BSODs too)

Original [published here](md_blog/2009/0714_GNULinuxEmergencyRestart.md).

---
## In reply to this post, [David]() commented @ 2010-05-18T17:40:57.000+02:00:

Seems to me you don't need the first 3. "R" seems nice, though.
"SUB" should be enough. I didn't know about "U". I've been doing "SSSSSSB" for years...

Original [published here](md_blog/2009/0714_GNULinuxEmergencyRestart.md).

---
## In reply to this post, [nico](md_blog/aboutme.md) commented @ 2010-05-18T17:51:10.000+02:00:

> David

May be so may be not, but the look of awe when people look at you pressing a magical 18 key combo to reboot is priceless.

Original [published here](md_blog/2009/0714_GNULinuxEmergencyRestart.md).

---
## In reply to this post, [Dan]() commented @ 2010-05-18T18:21:33.000+02:00:

Why do people keep spelling fist f--king: "fscking"?

Original [published here](md_blog/2009/0714_GNULinuxEmergencyRestart.md).

---
## In reply to this post, [yono]() commented @ 2010-05-24T18:53:29.000+02:00:

that's because they actually mean "fscking" - as in the verb "to run the fsck command"

http://linux.die.net/man/8/fsck

the point of this article is to cleanly shutdown your computer when you cannot use conventional commands or menus to do so. this prevents data corruption or an inconsistent disk state, which can sometimes be fixed by running the fsck command on the disk.

Original [published here](md_blog/2009/0714_GNULinuxEmergencyRestart.md).

---
## In reply to this post, [Dan]() commented @ 2011-06-27T04:09:35.000+02:00:

"It's not usual but it happens."

Yeah, like ever f'ing day.

Original [published here](md_blog/2009/0714_GNULinuxEmergencyRestart.md).
