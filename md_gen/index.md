#
@meta docType index
## Bash ',' is a legal function name, and a perfect prefix

Post by Nico Brailovsky @ 2024-03-15 | [Permalink](md_blog/2024/0315_BashCommaIsAValidFunctionName.md)  | [Leave a comment](https://github.com/nicolasbrailo/nicolasbrailo.github.io/issues/new?title=Comment@md_blog/2024/0315_BashCommaIsAValidFunctionName.md&body=I%20have%20a%20comment!)

If you have a set of [miscellaneous Bash-helpers](https://github.com/nicolasbrailo/Nico.rc) that you frequently use, you probably want some sort of namespace for easy access. For example, prepending the name of all your helpers with "myHelper-" is a good way of getting autocomplete to show only the relevant helpers you need. "myHelper-" is too much typining, though.

Unless your distro is extremely minimnal, all the letters in Bash are taken and you can't have an unambiguous single-letter "namespace". You need to look beyond letters: ',' is a ferpectly legal Bash name. You can prefix all your helpers with ',' for easy and quick autocomplete. An example [from my bashrc](https://github.com/nicolasbrailo/Nico.rc/blob/master/bash/android.sh):

```bash
function ,alogcat() {
  local MAYBE_TEE
  MAYBE_TEE="$1"
  adb logcat -c
  if [ -z "${MAYBE_TEE}" ]; then
    adb logcat
  else
    adb logcat | tee "$MAYBE_TEE"
  fi
}

function ,a-screen-off() {
  adb shell input keyevent 26
}
```

With this, I can type `,a` to get an autocomplete of just my Android helpers.





---

## Spotiweb

Post by Nico Brailovsky @ 2024-03-14 | [Permalink](md_blog/2024/0314_Spotiweb.md)  | [Leave a comment](https://github.com/nicolasbrailo/nicolasbrailo.github.io/issues/new?title=Comment@md_blog/2024/0314_Spotiweb.md&body=I%20have%20a%20comment!)

If you find the native client for Spotify is too cluttered, [Spotiweb](https://github.com/nicolasbrailo/Spotiweb) can provide a simpler experience. [Spotiweb](https://github.com/nicolasbrailo/Spotiweb) automatically goes through the list of your followed artists to create an index groupped by category. The categories will be automatically determined based on the artists you follow. The result will be a simple web page with an index of all the artists you followed, groupped by somewhat logical categories (when categories exist).

![SpotiWeb running looks like this](https://raw.githubusercontent.com/nicolasbrailo/SpotiWeb/master/screenshot.png)

You can use this service from [nicolasbrailo.github.io/SpotiWeb](https://nicolasbrailo.github.io/SpotiWeb/) - you will need a developer API key+secret. All the storage is local to your browser (there is no key, user data or anything at all being sent to any external host, everything is done in your browser) and you can even use this client offline (Spotify won't work offline, though). You can also self-host this service, either by forking the project or by running it via a local webserver.

This is a utility that grew somewhat organically from a simple index of artists; as more and more features of the native client got broken in my different setups, the web app "grew" to replace it. Today it's pretty much a full-fledged web-app capable of replacing the native client entirely, able to play music using Spotify's web sdk, integrate with the native client (if one is available) and with local speakers in your network.

 * [Project repo: Spotiweb](https://github.com/nicolasbrailo/Spotiweb)
 * [Run in your browser](https://nicolasbrailo.github.io/SpotiWeb/)





---

## Bash: list ALSA PCMs

Post by Nico Brailovsky @ 2024-03-04 | [Permalink](md_blog/2024/0304_FindRightPCM.md)  | [Leave a comment](https://github.com/nicolasbrailo/nicolasbrailo.github.io/issues/new?title=Comment@md_blog/2024/0304_FindRightPCM.md&body=I%20have%20a%20comment!)

Linux audio isn't friendly, even if pipewire is making huge strides in making it "just work". If you ever find you need to get down to the ALSA level, something is probably very broken. If (when) this happens, and you can't figure out which of your ALSA cards you should be using, just try them all:


```bash
set -euo pipefail

if [ -z "${1+x}" ] || [ ! -f "${1}" ]; then
  echo "Will iterate over all known PCMs to try to capture or play audio and report which work"
  echo "Usage: $0 PLAYABLE_FILE"
  exit 1
fi

sample=${1}
plays_pcms=$( aplay --list-pcms | grep ':CARD=' )
for dev in $plays_pcms; do
  aplay --duration=1 --device="$dev" "$sample" 1>/dev/null 2>/dev/null && \
    echo "Playback may work on interface '$dev'"
done

cap_pcms=$( arecord --list-pcms | grep ':CARD=' )
for dev in $cap_pcms; do
  arecord --rate 48000 -f S16_LE --disable-resample --duration=1 --device="$dev" \
      /dev/null 1>/dev/null 2>/dev/null && \
      echo "Capture may work on interface '$dev'"
done
```





---

## Vim can wget + c-w search

Post by Nico Brailovsky @ 2024-03-03 | [Permalink](md_blog/2024/0303_VimWgetSite.md)  | [Leave a comment](https://github.com/nicolasbrailo/nicolasbrailo.github.io/issues/new?title=Comment@md_blog/2024/0303_VimWgetSite.md&body=I%20have%20a%20comment!)

I (re?)learned a thing today: Vim can wget a site!

Doing `c-w gf` tells Vim to open whatever path is under the cursor. This is usually something like "#include <foo/bar/baz.h>", which means it will ask Vim to open `foo/bar/baz.h`. If you happen to have `http://nicolasbrailo.github.io` under your cursor, you'll be fetching this site into a temp buffer, in Vim.

## Bonus tip:

If `c-w gf` isn't finding the files you want it to, you may need to set your search path:

```vim
set path+=/home/user/path/to/foo,/home/user/src/bar
```





---

## Wifi from the CLI

Post by Nico Brailovsky @ 2024-03-01 | [Permalink](md_blog/2024/0302_CLIWifi.md)  | [Leave a comment](https://github.com/nicolasbrailo/nicolasbrailo.github.io/issues/new?title=Comment@md_blog/2024/0302_CLIWifi.md&body=I%20have%20a%20comment!)

Another one to file in the category of self reminders, and a cheatsheet I'll need this weekend: whenever I need to work on the main (eth!) connection of a server, instead of grabbing a keyboard and a monitor it's easier to connect to wifi. For example, when I need to change the IP of a Raspberry PI in my network. Note this guide assumes a Debian-like environment:

```bash
# Figure out which interfaces exist
ip a

# Figure out which interfaces are connected
ip link show
# For example:
ip link show wlp3s0
```

Restart the interface (which will do nothing, because it's probably not autoconfigurable)

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

Connect:

```bash
# Connect
wpa_supplicant -B -i wlp3s -c < $( wpa_passphrase "your ssid name" "password" )
# Request IP
dhclient wlp3s0
# Confirm connection
ip addr show wlp3s0
```

Work on main interface (leave on a loop, in case wifi disconnects for whatever reason)

```bash
while true; do dhclient -r eno1 ; dhclient eno1 ; ip addr show eno1; sleep 1; echo "DONE"; done 
```

When done, kill wifi

```bash
ip link set wlp3s0 down
# Release addr locally
dhclient -r wlp3s0
# To be sure:
rfkill
```





---

## Bash: goto

Post by Nico Brailovsky @ 2024-03-01 | [Permalink](md_blog/2024/0301_BashGoto.md)  | [Leave a comment](https://github.com/nicolasbrailo/nicolasbrailo.github.io/issues/new?title=Comment@md_blog/2024/0301_BashGoto.md&body=I%20have%20a%20comment!)

I rediscovered a nifty little utility I added to my [bashrc](https://github.com/nicolasbrailo/Nico.rc) a while back: [goto](https://github.com/nicolasbrailo/Nico.rc/blob/master/bash/goto.sh). Goto is a short script that works as a bookmark mechanism for Bash. With it, you can set a bookmark directory, and then jump to that directory from anywhere else (with autocomplete). For example:

```bash
$ cd foo/bar/baz
foo/bar/baz$ goto . bookmark
foo/bar/baz$ cd /
/$ goto boo<tab>
foo/bar/baz$
```

It works by setting itself as a Bash autocomplete, so that bookmarks are autocompletable and available anywhere in Bash. A bookmark is itself nothing more than a symlink saved to `~/goto`.

To install, you can `wget -O - https://github.com/nicolasbrailo/Nico.rc/blob/master/bash/goto.sh > ~/.goto.sh` and add it to your bashrc.





---

## MdLogGen

Post by Nico Brailovsky @ 2024-02-25 | [Permalink](md_blog/2024/0225_MdlogGen.md)  | [Leave a comment](https://github.com/nicolasbrailo/nicolasbrailo.github.io/issues/new?title=Comment@md_blog/2024/0225_MdlogGen.md&body=I%20have%20a%20comment!)

If you're reading this, you somehow found me at [nicolasbrailo.github.io](https://nicolasbrailo.github.io/blog). Maybe you came here from [one of my many previous blogs](md_blog/2024/0218_MovedAgain.md), and you're marveling at the beautiful new design (?). As I alluded to in the ["moved again"](md_blog/2024/0218_MovedAgain.md) note, this site is built from a source of md files, [using a custom md-to-html enginge](https://github.com/nicolasbrailo/MdlogGen). If you're sane, you're probably why I would create an md-to-html engine, instead of using one of the many available options.

## MdlogGen: yet another MD site generator

[MdlogGen](https://github.com/nicolasbrailo/MdlogGen) is a simple md-to-static-html, however it supports a few features I wasn't able to find elsewhere: comments, and site-search. MdlogGen depends on Github for these two features (or, rather, depends on the viewer to have a Github account to be able to use these two features).

MdlogGen also supports the exact feature set I need, no more and no less; while using an off-the-shelf generator may have been a better longer term investment, 90% for the raison d'etre of this site is "for fun", and spending a weekend writing hacky code is more fun than spending a weekend trying to figure out how to configure Github deploy rules, and learning to use a third party content generator. I get to write enough code for a living during the week - weekends are for fun code! An alternate reason is that I already had to spend a chunk of time cleaning XML exports from my previous sites to build this one - so MdlogGen is sort of a natural evolution of those scripts. Kind of.

Check out [MdlogGen](https://github.com/nicolasbrailo/MdlogGen)'s reamde: while many other md-to-html generators exist, I think this may be one of the simplest feature-complete generators out there.





---

## Bash tip: expand args

Post by Nico Brailovsky @ 2024-02-25 | [Permalink](md_blog/2024/0225_BashTipExpandArgs.md)  | [Leave a comment](https://github.com/nicolasbrailo/nicolasbrailo.github.io/issues/new?title=Comment@md_blog/2024/0225_BashTipExpandArgs.md&body=I%20have%20a%20comment!)

If you're writing a script and it looks like this

```bash
your_bin --arg1 \
         --arg2=123 \
         --arg3=345 \
         --arg4...
```

It can get pretty ugly to maintain. Instead, try this:

```bash
many_args=(
  --arg1
  --arg2=123
  --arg3=345
  --arg4...
)

your_bin "${many_args[@]}"
```





---

## Fix "slow" Grub

Post by Nico Brailovsky @ 2024-02-23 | [Permalink](md_blog/2024/0223_FixSlowGrub.md)  | [Leave a comment](https://github.com/nicolasbrailo/nicolasbrailo.github.io/issues/new?title=Comment@md_blog/2024/0223_FixSlowGrub.md&body=I%20have%20a%20comment!)

Grub tends to be setup-and-forget, so this is a tip that should be useless. Except when things break.

I noticed while fixing a computer that Grub was "slow" - each keystroke would take about half a second to show up on the screen, give or take a hundred ms, and it wouldn't even queue my keystrokes (leading to skipped keys, and even more frustrating sessions of backspace-backspace-backspace, fix-fix-fix, repeat). This seems to be related to Grub running in a very high resolution, which should be entirely unnecessary - I don't care about 4K boot menus, nor about 4K boot splash screens that will be displayed for a second or two.

To fix slow-Grub, it's enough to tell it to stick to a more terminal-friendly resolution. Debian-based example:

Add this to /etc/default/grub

```bash
GRUB_GFXMODE=1024x768
GRUB_CMDLINE_LINUX_DEFAULT="nosplash verbose debug nomodeset"
```

Then run `update-grub`. Next boot up Grub input should behave in a sane way again.

## Extra tip: Increase terminal font size without murking in Grub

If you got past Grub, you're probably booting into 4K mode terminals, and texts that are but a few millimiters high. You can increase your terminal font size, before ever going to a graphical interface:

```bash
setfont /usr/share/consolefonts/Uni3-Terminus32x16.psf.gz
```

## Extra extra tip: Kernel arcana

If you're reading this, you're probably looking for `debug verbose nomodeset earlyprintk=vga loglevel=7 ignore_loglevel`





---

## How to: UEFI shell

Post by Nico Brailovsky @ 2024-02-20 | [Permalink](md_blog/2024/0220_UefiCheatsheet.md)  | [Leave a comment](https://github.com/nicolasbrailo/nicolasbrailo.github.io/issues/new?title=Comment@md_blog/2024/0220_UefiCheatsheet.md&body=I%20have%20a%20comment!)

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





---

@meta extraNav [Next](md_gen/index1.md)