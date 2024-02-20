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

