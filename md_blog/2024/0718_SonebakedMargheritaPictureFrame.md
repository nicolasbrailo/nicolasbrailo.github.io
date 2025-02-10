# Homeboard P0: Stonebaked Margherita Picture frame

@meta publishDate 2024-07-18
@meta author Nico Brailovsky
@meta tags IoT, RaspberryPi, Homeboard

With my homeboard booting up, it's time to make it show something. Some day I'll build a net-boot capable system, but until then I'd like to have it do something, even if it's by installing a few services by hand.

[![](/blog_img/0714_HomeboardP0/6FirstBoot.jpg)](/blog_img/0714_HomeboardP0/6FirstBoot.jpg)

## SD bootstrap

[Feb 25 edit: added this section]

An Rpi Zero won't do much without one, so, starting with a base Raspbian Bookworm for Rpi Zero (32 bit), with no GUI:

* [Download an ISO](https://www.raspberrypi.com/software/operating-systems/) compatible with the board
* `sudo dd of=/dev/sdX if=./XXXX.img bs=8M status=progress`
* Mount sd card, then
* Enable ssh: `cd /media/$USER/bootfs && touch ssh && touch ssh.txt`
* [Create user (headless)](https://www.raspberrypi.com/documentation/computers/configuration.html#configuring-a-user): `echo username:password > /media/$USER/bootfs/userconf.txt`

These steps will give you an sd card that should boot and automatically connect to an eth connection (not wifi, of course), and let you ssh into the device to continue the setup. No need to hook up a keyboard.


## First boot

Optional: UART is useful to debug the first boot, but if the SD bootstrap was successful everything should just work.

* Debug why the system doesn't boot, as with any new install
* UART into the system, then enable SSH (because the USB ports are hard to reach to connect a keyboard)
* Disconnect UART, reconnect sensors, login over SSH
* apt-get update, upgrade, etc...

## Prepare Wayland

Raspbian Bookworm 32bit doesn't have support for Wayland out of the box. To enable:

* Add this magic to /boot/firmware/config.txt

```bash
dtoverlay=vc4-kms-v3d
gpu_mem=128
```

* /boot/firmware/cmdline.txt needs to have `wayland=on` 
* sudo apt-get install mesa-utils-bin wayfire 
* reboot
* After booting up, it should be possible to run `wayfire` in a terminal; an empty Wayland screen (with a cursor) should show up

## Screen rotation

Because of the way the flex cable is fed to the HDMI-to-eDP board, the screen may end up rotated 180 degrees. You may also want a portrait picture frame, instead of a landscape one. To rotate Wayland:

1. Do `kmsprint` or `kmsprint -m`
2. Look for the name of the screen, eg HDMI-A-1
3. Look for the mode, eg 1920x1080@60.00
4. Create this in ~/.config/wayfire.ini, replacing the values found above for your setup

```bash
[output:HDMI-A-1]
mode = 1920X1080@60.00
position = 0,0
transform = 90
```

No need to reboot Wayfire, it should pick up the changes and fix itself immediately. I think.


## swayimg

With a GUI, it's time to show a picture. I [hacked swayimg to load pictures from a local server](https://github.com/nicolasbrailo/swayimg), plus a few other useful features to make it more usable in a RpiW, like consuming less memory than default, and porting to 32 bits. To install dependencies:

```bash
sudo apt-get install libcurl git ninja-build meson
sudo apt-get install libcurl4-openssl-dev
sudo apt-get install libwayland-dev wayland-protocols
sudo apt-get install libjson-c-dev libxkbcommon-dev libfontconfig-dev libjpeg-dev
```

To build: [Yes, this is building swayimg in our target. This is horrible and will take a long time, so be prepared for a long coffee break. Some day I'll setup a crosscompiler].

```bash
git clone https://github.com/nicolasbrailo/swayimg.git
meson setup [build|--wipe build]
ninja -C build
```
Make sure the `meson` step finds curl and libjpeg, otherwise it won't be a very useful LAN picture frame.

To start:

* Launch Wayfire in a terminal
* In another terminal:
* `WAYLAND_DISPLAY="wayland-1" DISPLAY="" /home/batman/swayimg/build/swayimg`

Check that nothing crashes too much.

## P0 picture frame

With everything "working", we can make Wayfire and swayimg a system service, so they'll start at boot:

Add this to `/etc/systemd/system/wayfire.service` (change the user name):

```config
[Unit]
Description=wayfire
After=multi-user.target

[Service]
Environment=XDG_RUNTIME_DIR=/run/user/1000
ExecStart=wayfire
StandardOutput=inherit
StandardError=inherit
Restart=always
RestartSec=10s
User=batman

[Install]
WantedBy=multi-user.target
```

Also this to `/etc/systemd/system/ambience.service` (also change the user name. Or make a new user):

```config
[Unit]
Description=ambience
After=multi-user.target

[Service]
Environment=XDG_RUNTIME_DIR=/run/user/1000 WAYLAND_DISPLAY="wayland-1" DISPLAY=""
ExecStart=/home/batman/swayimg/build/swayimg
StandardOutput=inherit
StandardError=inherit
Restart=always
RestartSec=3s
User=batman

[Install]
WantedBy=multi-user.target
```


Then:

* `sudo systemctl daemon-reload`
* In a terminal: `journalctl --follow --unit wayfire --unit ambience`
* In another terminal:

```bash
sudo systemctl enable wayfire
sudo systemctl enable ambiene
sudo systemctl restart wayfire
sudo systemctl restart ambience
```

Next time you boot up, the Stonebaked Margherita P0 frame should behave like a picture frame.

