# CLI music FTW!

@meta publishDatetime 2012-12-13T08:00:00.000+01:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2012/12/cli-music-ftw.html

Does your music collection suck? Did you have to delete all your mp3 because you were facing a major lawsuit by the MPAA? Make your own console-music! Just open a terminal and type this for hours of endless fun:

```c++
cat /dev/urandom | aplay
```

Aditional tip: if you ever get tired of the random static, you can have fun playing your boot images like this:

```c++
cat /boot/initrd.img-3.0.0-12-generic | aplay
```

I wonder if that has copyrights....

