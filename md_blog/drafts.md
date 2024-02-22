# Drafts


@meta docType skipHtmlGen

# Vim can wget
c-w gf on url creates tmp


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

