# Ubuntu: Dual screen still FUBAR'd

@meta publishDatetime 2010-04-27T09:00:00.000+02:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2010/04/ubuntu-dual-screen-still-fubar.html

I'm quite sure I have written about this before but I'm too lazy to search for the article right now. Well, dual screens in Ubuntu still sucks. Much less than ever before, granted, but it still works quite bad. In my specific case the whole desktop is shown, in both monitors (which by itself is a huge improvement over previous versions) but the working area is clipped to the notebook's monitor size. Not nice.

To fix this problem (more like hacking it away, actually) I keep a handy bash script in the top left corner on my desktop:

```c++
xrandr --output HDMI-2 --right-of HDMI-1 --mode 1680x1050 --rotate normal
```

Also, as I have two nice rotable monitors at work it's nice that now Ubuntu supports actually rotating the picture displayed in the monitor (thanks Ubuntu for coming up to speed... with windows 98, that is). Obviously I keep another script for this, as it doesn't really work by default:

```c++
xrandr --output HDMI-1 --left-of HDMI-2 --mode 1680x1050 --rotate left
xrandr --output HDMI-2 --left-of HDMI-1 --mode 1680x1050 --rotate normal
```

Even though I love bashing Ubuntu (and bash) I'm quite confident most, if not all, of this issues will be gone in future versions of the OS.


---
## In reply to [this post](), [Nicolás Brailovsky » Blog Archive » Dell and Ubuntu CPU Scaling](md_blog/2011/1020_DellandUbuntuCPUScaling.md) commented @ 2011-10-20T09:06:40.000+02:00:

[...] me from movies like fixing keyboard problems in Ubuntu JJ, removing the annoying terminal warning, random complaints about dual screen in Buguntu and Ubuntu: sound still fubard. This time, I would like to add a new Ubuntu problem to the list of [...]

Original [published here](md_blog/2010/0427_UbuntuDualscreenstillFUBARd.md).
