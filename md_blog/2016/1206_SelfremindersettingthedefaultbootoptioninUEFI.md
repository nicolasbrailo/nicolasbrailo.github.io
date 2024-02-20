# Self reminder: setting the default boot option in UEFI

@meta publishDatetime 2016-12-06T08:00:00.000+01:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2016/12/self-reminder-setting-default-boot.html

Bought a new laptop (\*) and I'm 100% sure I'll forget this if I don't put it here:

From http://askubuntu.com/questions/291905/how-can-i-make-ubuntu-the-default-boot-option-on-a-newer-laptop-uefi

 To set Ubuntu as the default boot OS in a multi-OS setup (ie, dual boot Windows) with UEFI, goto Windows and exec (as admin) bcdedit /set {bootmgr} path \EFI\ubuntu\grubx64.efi

Why am I using Windows, you may ask? I'm still in the process of discovering which features will be broken and which hardware will work out of the box. So far I'm actually quite surprised, with only the video card and the touchpad not working. Luckily bash doesn't use either of those. Who needs a mouse anyway?

