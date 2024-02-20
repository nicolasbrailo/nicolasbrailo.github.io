# PSA: OEM unlocks may result in wiped filesystems

@meta publishDatetime 2016-02-11T08:00:00.000+01:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2016/02/psa-oem-unlocks-may-result-in-wiped.html

o, I bricked my tablet. Turns out the bootloader couldn't mount /data: after doing an oem unlock thingy, /data gets wiped and (this is the part the manual I was following didn't warn me about) no filesys is created.

If this happens, go back to recovery mode, then adb shell and run 'mount /data'. This will give you an error like "Can't mount /dev/block/mmcblk0p23". Write down the /dev/block id and run 'mke2fs -t ext4 /dev/block/mmcblk0p30'. That should fix it.

In some systems you may be missing libext2\_quota.so. If this happens, just look for libext2\_quota.so in the interwebs, then adb push this file into /sbin.

