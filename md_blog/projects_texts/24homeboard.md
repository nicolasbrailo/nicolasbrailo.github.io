# Homeboard

@meta publishDate 2024-07-20
@meta author Nico Brailovsky
@meta tags IoT, RaspberryPi, Homeboard

![](/blog_img/2026/0509_homeboard.jpg)

From [the project's repo](https://github.com/nicolasbrailo/homeboard):

Homeboard is a project to display pictures and an arbitrary SVG overlay with information through a PoE picture frame (you can see above my creative attempt at hiding the ethernet cable run with some decorations).

- On startup, connects to [wwwslider](https://github.com/nicolasbrailo/wwwslide) to retrieve images. The device is mostly stateless, no need to pre-provision pictures or config (just the software, until I make it bootable over LAN).
- Connects to an MQTT broker for remote-control. [wwwslider](https://github.com/nicolasbrailo/wwwslide) provides a remote-control interface.
- Displays pictures, but only when you are around. It has a presence sensor so that the screen will turn off when no one is there to see the pictures (bonus: you can use this as an overcomplicated presence sensor for home automation over MQTT).
- Integrates with [ZMW, my home automation project](https://github.com/nicolasbrailo/zmw/tree/main/zmw_homeboard). ZMW can push an SVG overlay, which I am using to show the weather, announcements and a QR code for the remote control URL.

@include md_blog/2024/0630_HouseboardP0.md
@include md_blog/2024/0707_HouseboardHdmiToEdp.md
@include md_blog/2024/0714_StonebakedMargheritaHomeboard.md
@include md_blog/2024/0718_SonebakedMargheritaPictureFrame.md
@include md_blog/2024/0909_wwwslide.md
@include md_blog/2024/1012_rpixcompile.md
@include md_blog/2024/1028_waylandonx.md
@include md_blog/2025/0209_HomeboardIndustrialDesign.md
@include md_blog/2025/0216_HomeboardBootstrapV2.md
@include md_blog/2025/0223_HomeboardEInkDisplay.md
@include md_blog/2025/0315_HomeboardNewFrameMount.md
@include md_blog/2025/0316_HomeboardHardwareBug.md
@include md_blog/2026/0423_HomeboardN1.md
@include md_blog/2026/0509_HomeboardComplete.md

