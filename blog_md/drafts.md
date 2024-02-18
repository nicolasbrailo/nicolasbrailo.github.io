# How to: UEFI shell

@meta author Nico Brailovsky
@meta publishDatetime TODO
@meta tags Self reminder, Fixing stuff

There are countless "how to use an UEFI shell" notes out there, but this is the cheatsheet I tend to use:

```bash
# Set video to 80cols 50 rows, so it's less tiny in a 4k screen
mode 80 50

# Show pci device tree. Eg to find the VGA controller
devtree

# Show all things that have a FS may be bootable
map

# Refresh list of devices, if a new one is connected
map -r

# Show maybe bootable things that look like a usb
map -t cdrom

# Inspect a fs attached to a mapping (eg when looking at fs0, from the output of §map§)
# Case sensitive, uses fwd slashes and not back slashes
ls fs0:
ls fs0:EFI\BOOT\

# Moving around: first select mapped device, eg
fs1:

# Then cd and ls works
cd efi
ls
```

Eg to boot a Debian live USB on my setup

```bash
shell> mode 80 50
shell> map  -t cdrom
shell> FS0:
shell> FS0:
FS0:> cd efi\boot
FS0:\efi\boot> ./grubx64.efi
```




# Fix "slow" Grub

@meta author Nico Brailovsky
@meta publishDatetime TODO
@meta tags Fixing stuff


Grub tends to be setup-and-forget, so this is a tip that should be useless. Except when things break.


I noticed while fixing a computer that Grub was "slow" - each keystroke would take about half a second to show up on the screen, give or take a hundred ms, and it wouldn't even queue my keystrokes (leading to skipped keys, and even more frustrating sessions of backspace-backspace-backspace, fix-fix-fix, repeat). This seems to be related to Grub running in a very high resolution, which should be entirely unnecessary - I don't care about 4K boot menus, nor about 4K boot splash screens that will be displayed for a second or two.

To fix slow-Grub, it's enough to tell it to stick to a more terminal-friendly resolution. Debian-based example:


Add this to /etc/default/grub

```bash
GRUB_GFXMODE=1024x768
GRUB_CMDLINE_LINUX_DEFAULT="nosplash verbose debug nomodeset"
```

Then run `update-grub`. Next boot up Grub input should behave in a sane way again.

## Extra tip: Increate terminal font size without murking in Grub

setfont /usr/share/consolefonts/Uni3-Terminus32x16.psf.gz



# Kernel arcana
debug verbose nomodeset



## Wifi from CLI + Working on main eth connection

Work on the main eth connection while connected to Wireless

Find out the state of network

```bash
## Figure out which interfaces exist
ip a

## Figure out which interfaces are connected
ip link show
ip link show wlp3s0
```

Restart the interface, which will do nothing

```
ip link set wlp3s0 down
ip link set wlp3s0 up
```

Start `wpa_cli`. Creating a new network may be needed, but I don't have notes. Once a network is created, its config will be in `/etc/wpa_supplicant/wpa_supplicant.conf`. Then:

```bash
$ wpa_cli
> scan
[Wait a few seconds]
> scan_results
> 
```

Connect?

```bash
# Connect
wpa_supplicant -B -i wlp3s -c < $( wpa_passphrase "<your ssid name>" "<password>" )
# Request IP
dhclient wlp3s0
# Confirm connection
ip addr show wlp3s0
```


Work on main interface (leave on a loop, in case wifi disconnects for whatever reason)

```bash
while true; do dhclient -r eno1 ; dhclient eno1 ; ip addr show eno1; sleep 1; echo "DONE"; done 
```

When done, showtdown wifi


## TODO rfkill?

```bash
ip link set wlp3s0 down
# Release addr locally
dhclient -r wlp3s0
rfkill
```

