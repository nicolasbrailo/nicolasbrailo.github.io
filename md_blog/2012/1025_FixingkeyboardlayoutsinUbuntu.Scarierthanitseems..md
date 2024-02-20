# Fixing keyboard layouts in Ubuntu. Scarier than it seems.

@meta publishDatetime 2012-10-25T09:00:00.000+02:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2012/10/fixing-keyboard-layouts-in-ubuntu.html

At the moment of writing this post there is an [open bug](https://bugs.launchpad.net/ubuntu/+source/gnome-control-center/+bug/591895) in Ubuntu, still active in 11.04, that makes your keyboard layout revert to whatever GDM wants. Apparently this is caused by GDM failing to synch with the preferences of the session, so if you change your layout (even if you delete the previous one) the change will be reverted next time you login. There seems to be no fix coming soon, so this magic incantation might work if you have this problem:

```c++
sudo dpkg-reconfigure keyboard-configuration
```

This will ask you a lot of questions about your keyboard, good luck guessing. It kind of reminds me the Windows 95 install process, in which erring the keyboard layout meant it was probably easier to just format and reinstall everything all over again. With some luck, next time you reboot your Ubuntu will actually remember your keyboard preference. If not, just take this as an opportunity to learn a foreign language.

Having keyboard problems? You may also be interested in learning [how to activate tildes and accents for a USA keyboard layout in Ubuntu](md_blog/2011/0908_ActivatingtildesandaccentsforaUSAkeyboardlayoutinUbuntu.md).

