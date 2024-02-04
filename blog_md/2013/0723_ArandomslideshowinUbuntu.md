# A random slideshow in Ubuntu

@meta publishDatetime 2013-07-23T09:00:00.000+02:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2013/07/a-random-slideshow-in-ubuntu.html

The other day I wanted to use my tv for a slideshow of my travel pictures. Something simple, just select a folder and have a program like Shotwell create a slideshow with a random order on my tv. Of course, Ubuntu and double screen equals fail. For some reaason all the programs I tried either were incapable of using the tv as the slideshow screen (even after cloning screens... now that's a wtf) or where not able to recursively use all the pictures in a folder.

feh to the rescue. It's not pretty, but feh seems to be exactly what I was looking for. It's a CLI application for Linux and after some RTFM I came up with this script:

```c++
feh ~/Pictures \
     --scale-down \
     --geometry 1920x760 \
     --slideshow-delay 9 \
     --recursive \
     --randomize \
     --auto-zoom \
     --draw-filename \
     --image-bg black
```

You can probably figure out by yourself what each option means. If not, just man feh.


---
## In reply to [this post](), [John Evans](/blog_md/youfoundadeadlink.md) commented @ 2013-09-07T10:13:06.000+02:00:

Hi Nicolas,
Thanks for this, I was amazed that none of the several programs I have, (gwenview, shotwell, default image viewer etc) allow you to simply start a slideshow and have it show in a random order. I can't get feh to work on my second monitor(even with --geometry 1920x1080+1800+0). I think that's a twin view issue though as from what I have read it only supports parts of xinerama.

Thanks again
John
:-)

Original [published here](/blog_md/2013/0723_ArandomslideshowinUbuntu.md).

---
## In reply to [this post](), [Feh (Русский) | Wanderer](/blog_md/youfoundadeadlink.md) commented @ 2013-12-29T00:36:46.000+01:00:

[…] A random slideshow in Ubuntu […]

Original [published here](/blog_md/2013/0723_ArandomslideshowinUbuntu.md).
