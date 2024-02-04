# Annoying "unable to find a medium containing a live file system" in
Ubuntu

@meta publishDatetime 2011-10-27T06:22:00.000+02:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2011/10/annoying-to-find-medium-containing-live.html

Sometimes you may get this message when installing Ubuntu. And it's not very helpful, the install just dies.

Assuming you created the installer appropriately (usb, live cd, whatever), once you reached that message it means that the BIOS already recognized your device as bootable, loaded the bootloader and started executing it. So it's the bootloader that can't find the image, yet that doesn't make sense if you think about it carefully: if the installer was properly created, that shouldn't happen.

Well, after fighting for a while I realized that some DVD drives connected to a high speed SATA port will give this kind of message error. From the message it's not very clear what causes it, so you can try with one of the crazy kernel options like noapic. If that doesn't work, you can try to change the SATA mode in the BIOS. ACHI worked for me.

