# KDE: Lock screen from CLI

@meta publishDatetime 2016-02-09T08:00:00.000+01:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2016/02/kde-lock-screen-from-cli.html

For some reason, one of my (seriously outdated) Kubuntu installations has the nasty habit of not locking the screen when pressing Ctrl+Alt+L. Not always, though. It seems to do this only when I'm in a hurry and need to quickly lock my PC before walking away. This happens often enough to be annoying, but not so frequently as to bother me enough to look for a proper solution.

Instead of looking for a proper solution, trying to determine what's stealing the focus of the Ctrl+Alt+L key command, I just settled for an easier workaround: lock the screen from the command line. I use the terminal most of the time anyway, so why not just use it to lock the screen as well?

The magic incantation is easy, if a bit cryptic at first:

```
qdbus org.freedesktop.ScreenSaver /ScreenSaver Lock
```

"qdbus" is a broadcasting service for KDE (Qt, actually). This command basically tells the screen saver service to lock the screen. Works every time, and with an alias in my [bashrc](https://github.com/nicolasbrailo/Nico.rc/blob/master/bash_aliases#L22 "bashrc"), I don't need to remember that horribly long command. Now I only need to determine if my computer detecting when I'm in a hurry is a sign of sentience, and whether this is a threat to mankind. Will report soon.

