# Drafts

@meta docType skipHtmlGen

# Backup your Github repos

I try to back up all my online accounts, in case a provider ceases to exist, or one of my accounts is banned for (unknowingly!) breaking terms-of-service. The other day I figured I wasn't doing that with Github, so I wrote [a script to back up all my (or any user's) repos automatically](https://github.com/nicolasbrailo/Nico.rc/blob/master/github.backup.sh):

```bash
wget -q "https://api.github.com/users/$USER/repos" -O- > idx.json
for repo in $( cat idx.json | jq '.[].ssh_url' ); do
  git clone --recurse-submodules "$repo"
done
```

This will clone all *PUBLIC* repos to a local computer, from which you can tar.gz and upload to your preferred archive service.


# Bash: dynamic PS1 based on terminal size

Another utility I recently rediscovered in my [bashrc](https://github.com/nicolasbrailo/Nico.rc): [dynamic PS1 based on terminal size](https://github.com/nicolasbrailo/Nico.rc/blob/master/bash/ps1.sh). Of course, I've had this enabled for years, but I never really "noticed" it: it's just how Bash works, right?

[ps1.sh](https://github.com/nicolasbrailo/Nico.rc/blob/master/bash/ps1.sh) will do a few things:

* Assign a host number to your computer, so that it has a unique(ish) color. This lets you ssh all around, and you can immediatly know in which host your are even if you don't remember the hostname.
* Set a SHORT_PS1, with nothing bug a time and a prompt
* Set LONG_PS1, which by default has time, host and path

Using [Bash traps](md_blog/2015/0416_BashtrapsalmostlikeRAIIforbash.md), it's possible to detect when the terminal changes size: you need to `trap $YOUR_FUNC SIGWINCH`. You can [download this script](https://github.com/nicolasbrailo/Nico.rc/blob/master/bash/ps1.sh), add it to your bashrc in a trap, and get dynamic prompts depending on your terminal width.


https://github.com/nicolasbrailo/SpotiWeb
https://github.com/nicolasbrailo/GitToDo
https://github.com/nicolasbrailo/PyTelegramBot
https://github.com/nicolasbrailo/PianOli
https://github.com/nicolasbrailo/wta
https://github.com/nicolasbrailo/zigbee2mqtt2web



# More random tips to debug a failing Linux

Once you're trying to read acpi tables, all hope is lost. But you may as well know how to dump an acpi table:

```bash
acpidump -b # Dump all tables
iasl -d *   # Decompile them into a human "readable" format
```

This will let you find ACPI entries for devices you care about, but they'll be cryptically named. To map them to something you may be able to identify, try

```bash
lspci -QvvPPnn  # Get tons of info from lspci, find one you like
lshw -C display # Or you can try lshw, too. Anything that will print a PCI path.
```

Once you have a PCI path, go to its sysfs entry. For example, for device 0:03:00:

```bash
cat /sys/devices/pci0000:00/0000:00:03.0/firmware_node/path
```

This should tell you the ACPI name of a PCI device. You can then use acpi_call to tinker with your devices, and break them even more.



# Booting and blocking a GPU

cd /sys/devices/pci0000:00/0000\:03\:00.0
echo 1 > remove
This removes from pci tree in OS but doesn't disable device

#Let linux inherit graphic mode from grub
set linux_gfx_mode=keep
export linux_gfx_mode

Then add nomodeset to kerenel params
pcistub="pci-stub.ids=8086:46a6"


# Debug slow systemd boot

systemd-analyze plot > ./boot.svg
systemd-analyze blame


