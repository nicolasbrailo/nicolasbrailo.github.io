# Boot Linux in single user mode

@meta publishDatetime 2012-12-04T08:00:00.000+01:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2012/12/boot-linux-in-single-user-mode.html

Sooner or later, you'll need a safe boot mode for Linux. Maybe you forgot your password, maybe you need to recover some files of a really really broken system (shame on you for not using a different partition for /home). Luckily in any Linux server you can probably interrupt Lilo or Grub and add to the kernel line the following parameter init="/bin/sh". This will give you a root command shell from which you can do other fun recovery tasks.

Admin tip: Just don't forget to fill up on coffee before starting.

