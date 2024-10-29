# Homeboard: Wayland on X

@meta publishDate 2024-10-28
@meta author Nico Brailovsky
@meta tags IoT, RaspberryPi, Homeboard

Besides [cross-compiling to RaspberryPi](md_blog/2024/1012_rpixcompile.md), at times it's also useful to just run things locally. While faster than building on the target, the cycle of xcompile and deploy is still cumbersome for short sessions (i.e. when the target is usually offline, unpowered, and possibly lost somewhere in my house). For these situations, I found out I can run Wayland based apps on top of my X-based desktop, using Weston.

Weston is an implementation of Wayland. If you don't have it already, you can `apt-get install weston`. If you do this in an X based desktop, you can still run weston in a terminal, inside X.

[![](/blog_img/241028weston.jpg)](/blog_img/241028weston.jpg)

Between Wayland on X and [cross-compiling to RaspberryPi](md_blog/2024/1012_rpixcompile.md), I can test my fork (hack) of [Swayimg](https://github.com/nicolasbrailo/swayimg) for RaspberryPi Zero.

