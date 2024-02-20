# Ubuntu: Sound still FUBAR'd

@meta publishDatetime 2010-05-04T09:00:00.000+02:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2010/05/ubuntu-sound-still-fubar.html

Remember my problems with [dual screen support](md_blog/2010/0427_UbuntuDualscreenstillFUBARd.md) in Ubuntu? Well, I still love bashing Ubuntu, and the sound system in Linux is certainly a topic to rant a lot. Making the sound work fine in Ubuntu is an odyssey in pain and frustration, unless it works fine out of the box. And even if it does, it may still have it's kirks. Lots of them.

In my case the sound starts in mute. I know it's a problem with pulse (which is a WTF in itself) and alsa, I don't really care what's the problem though, I just want to play my mp3s collection without having to carefully turn the knobs up to eleven in alsamixer.

After trying a lot of the "solutions" found on the internets I've decided the best thing to do, short of switching back to windows me, is adding the following to my "fix\_ubuntu\_fuckups.sh" start script, which already contains my dual-screen pseudofix:

```c++
amixer -c0 -- sset Master playback -0dB unmute
amixer -c0 -- sset Headphone playback 0dB unmute
amixer -c0 -- sset Front playback 0dB unmute
amixer -c0 -- sset PCM playback -16dB unmute
```

This sets alsamixer to normal volume levels. As for the real fix, I'll wait till the next Ubuntu version. I wonder which sound subsystem will they chose next time.

