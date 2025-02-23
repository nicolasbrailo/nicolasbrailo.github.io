# Homeboard V1, bootstrap V2

@meta publishDate 2025-02-16
@meta author Nico Brailovsky
@meta tags IoT, RaspberryPi, Homeboard

With ~most~ some of the [bugs fixed in the industrial design](md_blog/2025/0209_HomeboardIndustrialDesign.md), it's time to setup a second Homeboard. That way I can experiment on one, while the other shows pretty pictures. Because my computer is also a new install, it's now a good opportunity to document the full bootstrap process from an almost brand new and clean Ubuntu 24.04.

## Bootstrap a new devenv

* Get normal dev tools `sudo apt-get install build-essential git llvm vim`
* The linker needs to learn how to build arm binaries: `sudo apt-get install crossbuild-essential-armel crossbuild-essential-armhf`
* Clone the sw project: `git clone git@github.com:nicolasbrailo/homeboard.git`
* Don't forget to `git submodule update --init --recursive`
* Type `make xcompile-start` in the root of gpio_mon. It will, on its first run, setup the [cross-compile environment](md_blog/2024/1012_rpixcompile.md).
* The x-compile env will be "hardcoded" to some rpi image, for example `2024-11-19-raspios-bookworm-armhf.img.xz`. You probably want to update `~/src/homeboard/pi_gpio_mon/rpiz-xcompile/mount_rpy_root.sh` to make it point to a newer image, ideally the same one you will use to bootstrap the sd card.
* Once `make xcompile-start` finishes, you can check it succeeded; `~/src/xcomp-rpiz-env/mnt` should contain a copy of the rpi environment (the x-compile root)


## Bootstrap the OS

[This article](md_blog/2024/0718_SonebakedMargheritaPictureFrame.md) has been updated to work, but the gist of it is:

* Find the ISO you used for the x-compile env, then `sudo dd of=/dev/sdX if=./XXXX.img bs=8M status=progress`
* Mount the SD card and enable ssh: `cd /media/$USER/bootfs && touch ssh && touch ssh.txt`
* [Create user (headless)](https://www.raspberrypi.com/documentation/computers/configuration.html#configuring-a-user): `echo username:password > /media/$USER/bootfs/userconf.txt`
* [Wayland] Add this magic to /boot/firmware/config.txt

```bash
dtoverlay=vc4-kms-v3d
gpu_mem=128
```

* [More Wayland] /boot/firmware/cmdline.txt needs to have `wayland=on`
* Boot up with the SD card, then ssh into the device and do `sudo apt-get install mesa-utils-bin wayfire seatd`
* [Add Wayfire as a service](md_blog/2024/0718_SonebakedMargheritaPictureFrame.md)


## Build things

* Update the TARGET_IP in the makefile, then `make setup-ssh` to enable passwordless ssh
* Start with the `gpio_mon` project, it's the simplest. `cd ~/src/homeboard/pi_gpio_mon`. If you `make`, it will either fail or create a binary in the wrong format if you haven't set up the [cross-compile environment](md_blog/2024/1012_rpixcompile.md) (see "bootstrap new devenv").
* After `make` succeeds, `file gpiomon` should show something like `ELF 32-bit LSB pie executable, ARM, EABI5 version 1 (SYSV), dynamically linked`. This means your system can now build binaries for your target platform.
* `scp gpiomon $target` -> try out if your xcompile env works as expected


## Build harder things

* Move on to `wl_display_toggle` (it's the smallest project that exercises the entire stack: cross compiler and Wayfire).
* There are more system deps you'll need to install; `make install_system_deps` should take care of most of them.
* There are deps for the x-compile env too; `make install_sysroot_deps` should take care of most of them. Some deps may move around, and you may need to find newer versions.
* Now `cd wl_display_toggle` then `make` and `scp wl_display_toggle $TARGET`
* ssh into the target, and try to shut off the display: `XDG_RUNTIME_DIR=/home/batman/run WAYLAND_DISPLAY="wayland-1" DISPLAY="" ./wl_display_toggle off`


## Install services

The homeboard doesn't do much nowadays, only show images; once you reached this point, and if things build and run, your build environment and target are ready to use. Just a few more arcane spells and we're done:

* Clean up binaries deployed ad-hoc, like gpio_mon and wl_display_toggle
* `make deploytgt`
* In the target, try out hackimg
    - Run `XDG_RUNTIME_DIR=/home/batman/run WAYLAND_DISPLAY="wayland-1" DISPLAY="" /usr/lib/arm-linux-gnueabihf/ld-linux-armhf.so.3 /home/batman/homeboard/bin/hackimg /home/batman/homeboard/cfg/hackimg.cfg`
    - You'll need to create the cache dir manually, because hackimg is lazy and won't do it for you
* Once you checked hackimg runs, `vi ~/homeboard/cfg/pipresencemon.cfg`
    - Set the sensor pin to the GPIO acting as presence sensor
    - Adapt the sensitivity to sensor type (mmwave vs PIR)
    - It's recommendable to use the mock gpio for a test run
* Try out the ambience service
    - 
* In the target, `cd ~/homeboard/scripts && ./install_svc.sh` - this will install the ambience service and launch it. Wayfire should already be a service by now, so no install is included.
* Use `~/homeboard/scripts/logs.sh` to see what's broken.

The target should be ready for production, in only about 30 simple steps!


## Appendix: it hangs!

[![](/blog_img/250216_Homeboard.jpg)](/blog_img/250216_Homeboard.jpg)
