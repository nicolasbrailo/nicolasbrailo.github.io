# Dell and Ubuntu CPU Scaling

@meta publishDatetime 2011-10-20T09:00:00.000+02:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2011/10/dell-and-ubuntu-cpu-scaling.html

Hi, my name is Nicolás Brailovsky and you may remember me from movies like [fixing keyboard problems in Ubuntu JJ](md_blog/2009/0505_FixingkeyboardproblemsinUbuntuJ.J..md), [removing the annoying terminal warning](md_blog/2009/0806_UbuntuAnnoyingterminalwarning.md), [random complaints about dual screen in Buguntu](md_blog/2010/0427_UbuntuDualscreenstillFUBARd.md) and [Ubuntu: sound still fubard](md_blog/2010/0504_UbuntuSoundstillFUBARd.md). This time, I would like to add a new Ubuntu problem to the list of things which make me want to jump off a cliff, though I must warn you that this is a very old article that got forgotten on the stack of posts to review, so it might be dated. Being an old post means that this problem may be fixed by now, but since I don't have a Dell laptop anymore I cannot try it. Anyway, I'll post it as a reference to anyone who may experience something similar.

To be completely fair, this is a dual fuckup between Dell and Ubuntu: after an upgrade I started noticing that sometimes the CPU slows to a crawl, for no apparent reason. The only fix for this is a complete shutdown, as not even a reboot would make this problem go away. WTF?

A lot of time after I had given up on trying to solve this problem and decided that submitting to the gods seemingly random will was the best option, a coworker told me what this was about: apparently when you have a 3D GUI (say, a screensaver) and a double monitor the graphics card has to "work too much", drawing too much power. When the power consumption reaches 90 watts, the power supply's limit, the CPU enables something called CPU scaling, bringing the CPU clock speed to about the speed of a wristwatch. No, really:

> "Even setting aside the negative performance effect of FSB downshifting in II above, the effective processing power is reduced to 1/8 of 798 Mhz = 100 MHz. This is a reduction to less than 5% of full capacity

-- from [BROKENLINK](md_blog/youfoundadeadlink.md)

Solution? None, thanks. Just shut it down and reboot.

