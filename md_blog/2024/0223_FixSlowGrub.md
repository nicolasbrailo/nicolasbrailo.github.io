# Fix "slow" Grub

@meta author Nico Brailovsky
@meta publishDate 2024-02-23
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

## Extra tip: Increase terminal font size without murking in Grub

If you got past Grub, you're probably booting into 4K mode terminals, and texts that are but a few millimiters high. You can increase your terminal font size, before ever going to a graphical interface:

```bash
setfont /usr/share/consolefonts/Uni3-Terminus32x16.psf.gz
```

## Extra extra tip: Kernel arcana

If you're reading this, you're probably looking for `debug verbose nomodeset earlyprintk=vga loglevel=7 ignore_loglevel`

