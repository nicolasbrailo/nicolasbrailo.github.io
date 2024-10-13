# Homeboard: Crosscompiling to RaspberryPi Zero

@meta publishDate 2024-09-12
@meta author Nico Brailovsky
@meta tags IoT, RaspberryPi, Homeboard


Homeboard continues progressing, albeit at a snail pace. Using a RaspberryPi Zero as the base board means not only the project runs at a leisurely pace, but so do any attempts at compiling software in the target itself. Because I got tired of measuring my build times in minutes, I decided it's time to set up a cross-compiler from my PC to my homeboard. This means I can now build things in my reasonably fast PC, and deploy the resulting binary to the RaspberryPi Zero.

Setting up a cross compiler from scratch can be challenging, as it requires replicating a large chunk of your target. Luckily, the Raspberry Pi is a popular platform and plenty of articles explaining how to set up a x-compiler are available. Unluckily, I found most of them didn't work for me, with my host being Debian Bookworm. In the end I managed to find a combination of arcane spells to make x-compiling work.

First, get a Raspberry Pi Zero image, and mount it locally. This will be the sys-root of the target when x-compiling:

```bash
wget https://downloads.raspberrypi.com/raspios_armhf/images/raspios_armhf-2024-07-04/2024-07-04-raspios-bookworm-armhf.img.xz
xz -d 2024-07-04-raspios-bookworm-armhf.img.xz

# Find out the mount-start offset (multiply by 512)
fdisk -lu "$IMG_FNAME" | grep Linux | awk '{print $2}'

mkdir -p mnt
mount -o loop,offset=541065216 2024-07-04-raspios-bookworm-armhf.img.xz ./mnt
```

And to build things:

```
clang -target arm-linux-gnueabihf -mcpu=arm1176jzf-s --sysroot ./mnt/ test.c
```

That's all; this should create a binary in armv6 format, ready to be deployed to your target. A few things I discovered:

* I couldn't make this work with gcc. I don't know why.
* If your `--sysroot` isn't correct, things won't work. You won't get an error, but a binary will still be built; it will just be a binary with the wrong format, and you'll only know because it will segfault on start. Good luck trying to figure out if the segfault is yours, or from a problem in the build process.


I wrapped this in a convenient bash script so you can build a [makefile that will x-compile easily, have a look here: https://github.com/nicolasbrailo/rpiz-xcompile](https://github.com/nicolasbrailo/rpiz-xcompile)
