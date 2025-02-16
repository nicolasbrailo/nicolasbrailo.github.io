#
@meta docType index
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

## Move again

Post by Nico Brailovsky @ 2024-02-18 | [Permalink](md_blog/2024/0218_MovedAgain.md)  | [Leave a comment](https://github.com/nicolasbrailo/nicolasbrailo.github.io/issues/new?title=Comment@md_blog/2024/0218_MovedAgain.md&body=I%20have%20a%20comment!)

I'm now at [nicolasbrailo.github.io](https://nicolasbrailo.github.io/blog). If I count platform, domain or tech-stack changes as a migration, I've now lost count of how many this site has had. It's the third one in the last few years. I moved away from WP because I wasn't happy with the sponsored content added to my site. I also wasn't happy with Blogger, I never quite like the interface, the way to write posts, or the customization options.

This site now came full circle: it started as a self-hosted php bundle, and it's now a kind-of-self-hosted static html site, [generated from .md files in Github](https://github.com/nicolasbrailo/nicolasbrailo.github.io). I figured I'm the person who reads this site the most, so I should like it. I'm a nerd, so I like writing code; hence the custom md-to-html converter, about which I should blog some time soon. This is also only meant as a fun project (and a great self-reminder mechanism, persistent through the decades) so why not reinvent the wheel, and create a custom md-to-html renderer for it?


## ToDo
* RSS doesn't work yet
* There are broken things from back the 2010's - I need to review old posts
* Some content isn't migrated yet


## Fun stats

* There are about 450 posts, in about 15 years. This means I'm quite lazy.
* Most of the external links are actually broken. If you browse the site, you'll notice the further back in time you go, the more dead links you get. This site has survived a non trivial chunk of the existing Internet.
* This blog started some time in 2008, and since then has had at least 5 domains (but possibly more)
    * nicolasb[com.ar]
    * monosinfinitos[com.ar]
    * monoinfinito.wordpress.com
    * monkeywritescode.blogspot.com
    * Now: [nicolasbrailo.github.io](https://nicolasbrailo.github.io/blog)
* Finally deleted all content from Wordpress - just today!
* I moved away from Wordpress in 2021. Somehow, the site still claims to have 20 visitors a day, even though there are no posts (other than a text saying "moved to...")
* I still haven't deleted all the content from Blogger - but it's in my ToDo list
* `wc $(find md_blog -type f)` says this blog has 116068 words in 16497 lines. This is comparable to 400 pages book, though not necessarily a good one. Google says 'The Return of the King' is about 135K words, and 'The Hobbit' is about 100K. 'Sense and Sensibility' comes closest at 119K words.





---

## Fix Spotify deeplinking in Linux + custom SpotiWeb UI

Post by Nico Brailovsky @ 2023-12-16 | [Permalink](md_blog/2023/1216_FixSpotifydeeplinkinginLinuxcustomSpotiWebUI.md)  | [Leave a comment](https://github.com/nicolasbrailo/nicolasbrailo.github.io/issues/new?title=Comment@md_blog/2023/1216_FixSpotifydeeplinkinginLinuxcustomSpotiWebUI.md&body=I%20have%20a%20comment!)

After a recent update I found [my custom Spotify UI (\*)](https://nicolasbrailo.github.io/SpotiWeb/) wasn't working. The way my custom UI works is by generating a simple list of followed artists, and then playing in the native app by using deep-linking. A recent update seems to have broken this in Linux based OSes, so here's my fix:

```bash
sudo mv /usr/share/spotify/spotify /usr/share/spotify/spotify.real
sudo echo '/usr/share/spotify/spotify.real --uri="$1"' > /usr/share/spotify/spotify

```

Seems old versions of spotify would try to open anything as a deeplink, but new versions require a `--uri` parameter on argv. Surely there is a cleaner way of doing this in xdg-open, but I'm too lazy to read manuals.

In the "reminder to myself" category, as there is zero chance I'll remember this next time I'm setting up a computer.

### (\*) SpotiWeb: custom Spotify UI

I don't like "recent" changes (recent being the last 3 or 4 years!) to Spotify's UI, [so I rolled out my own](https://nicolasbrailo.github.io/SpotiWeb/). It's a plain, boring, unobtrusive view of all your followed artists, grouped by categories. It also runs in any browser and is extremely minimalist (doesn't even have a search function: you can use the browser's search if you need one!)

The app is hosted in github pages, and because it's entirely client side it doesn't need any kind of server side support to run. Check out the source here and [either run your own, or check out there's no server side processing involved.](https://github.com/nicolasbrailo/SpotiWeb)





---

## Translated to Chinese!

Post by Nico Brailovsky @ 2023-01-14 | [Permalink](md_blog/2023/0114_TranslatedtoChinese.md)  | [Leave a comment](https://github.com/nicolasbrailo/nicolasbrailo.github.io/issues/new?title=Comment@md_blog/2023/0114_TranslatedtoChinese.md&body=I%20have%20a%20comment!)

Small celebratory post, because I never expected it:

[![](/blog_img/212446793-30c64252-a788-4a6d-81e2-e8f05f126497.jpg)](/blog_img/212446793-30c64252-a788-4a6d-81e2-e8f05f126497.jpg)

Someone translated [one of my open source projects](http://github.com/nicolasbrailo/pianOli) to Chinese!





---

@meta extraNav [Prev](md_gen/index1.md)