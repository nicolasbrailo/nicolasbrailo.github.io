# Ubuntu: Dual monitors

@meta publishDatetime 2009-08-11T09:00:00.000+02:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2009/08/ubuntu-dual-monitors.html

There's nothing better than feeling like a super villain by having a dual monitor setup. OK, three may be better, you probably couldn't hold back the evil laughter, but my laptop won't support three screens.

Fortunately, in Ubuntu JJ having a dual screen setup is a breeze. Just **plug the two monitors** and hope it works. Of course, it may not. If that's the case you can go to **System > Preferences > Screen** for a nice GUI, which will let you select each screen's resolution and position. Nothing better for productivity than having your monitors swapped, or even better, flipped upside down.

Well, sometimes "Screen Preferences" won't work either, too bad. In that' case you'll have to get dirty with **[xrandr](www.x.org/wiki/Projects/XRandR)**. It's not too difficult but it's console based (you're not scared of the console, are you?).

Though the man page for xrandr is a little bit intimidating at first you'll just have to do it once, so I won't write about using it, I will just copy & paste a script I keep in my desktop to fix the screen whenever it brakes (my lapop tends to foobar my screen when being docked or undocked, not sure why)

```c++
xrandr --output HDMI-2 --right-of HDMI-1 --mode 1680x1050 --rotate normal
```

I am sure you can figure out the rest on your own - enjoy the dual screen setup!

