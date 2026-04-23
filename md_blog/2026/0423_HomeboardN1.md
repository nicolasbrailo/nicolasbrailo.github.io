# Homeboard v2

@meta publishDate 2026-04-23
@meta author Nico Brailovsky

This week I decided to revive [my oldest homeboard](md_blog/projects_texts/24homeboard.md), one that suffered a bit of unplanned refactoring after a rapid encounter with the floor (about a year ago, now. Turns out I don't quite have enough time for all of my side projects, or I have too many side projects for my free time). Of course, it wasn't really a repair as much as a complete re-do, salvaging a few pieces here and there.

Side note: [xkcd 3233](https://xkcd.com/3233/) feels very autobiographical, and on topic for my homeboard series.

# Electrical changes

While the brains (a Raspberry Pi Zero), the display and the panel controller haven't changed, I found that this homeboard was rather unstable under load (when decoding and rendering a jpeg to screen). This would cause a brownout and the display to shut off for a second, which was quite jarring for a device meant to show pictures. Worse, sometimes this would happen on startup, making it enter a display restart loop (surprisingly, the RPI survived the brownouts).

The brownouts were probably caused by aging components in the boost converter that switched the 5v from the PoE output to 12v for the display controller, eating any margin for power consumption peaks. I changed this to use a 12V PoE output to feed the display, and then a 5V step down for the Pi. I don't know if it's just newer components or a simpler setup (step down is easier than boosting up), but the build was a lot more stable. The Pi is now fed through GPIO, which is limited in current compared to USB. That's probably a good thing, considering my PoE is limited to 12W anyway.

![](/blog_img/2026/0423_HomeboardN1_TestBench.jpg)

Though going from `PoE->Pi->Display` to `PoE->Display->Pi` made my system more stable, there were still transient drops in voltage and, rarely, brownouts causing the display to go off. I don't have any fancy measurement equipment, but I know the system is running at the power limit of my PoE adapter (around 12W), so I added a couple of 1000uF capacitors to handle the transients. 1000 was just a guess based on power usage and assuming a 10ms transient, which seemed reasonable to a layman in this area. This took care of any stability issues, and the system has been rock steady since.


# "Industrial design" changes

The new 12v PoE is smaller than my old 5v PoE, so I was able to reuse the old slot that housed it to put the mmWave sensor. This [had been a source of hardware bugs before](md_blog/2025/0316_HomeboardHardwareBug.md), and the new position lets me keep the sensor isolated from any electrical interference. I'm especially happy about this, as it means that while building this I learnt at least one thing.

The new version also incorporates a clip holder for the eink at the front, so now it's not floating around. It sticks to the (transparent) front pane and acts as a metadata display (here, year + city for the photo being displayed). I found the font needs to be quite large to be useful, which indicates that the screen is too small (about 3'') or that I am too old (both?).

Finally: sooo much tape. For this iteration, I tried to tape down anything that moved, to minimize cables breaking free and escaping. It helps, none of the fragile connection points move, but the end result is as if a mummy had assembled my homeboard. I bet if you are an industrial designer reading this note, you're crying right now. Ragemail welcome (ideally with suggestions to improve the design, too).

Not fixed in this version: there still isn't a good way to hang the frame. It hangs precariously from the wooden edge, without a notch to keep it in place. I was hoping the mount for the boards would double as a wall mount, too, but it's not sturdy enough to hold the weight.

# Software changes

Software changes have been massive, but of course less visible than hardware changes. While I still need to [update the repo](https://github.com/nicolasbrailo/homeboard), the new Homeboard doesn't use Wayland anymore. The system now uses DRM, with no compositor on top. This makes startup much faster - quite unnecessary for an appliance that restarts maybe once a year, but the architecture "feels" nicer. It also got split from one monolithic app into a set of services that interface over D-Bus. Perfect for LLMs to dig around and change the project. The software layer now is

* the main "ambience" service (showing pictures, announcements, driving the eink display, etc),
* an occupancy service, that announces if anyone is around to see the pictures,
* a DRM service, that owns the display management,
* a picture service, that provides photos to the ambience service (by [grabbing them from wwwslide](https://github.com/nicolasbrailo/wwwslide)),
* a D-Bus to MQTT bridge, enabling reporting and remote control of the device.

The new Homeboard software has working eink integration, so I can see picture metadata at a glance, and I finally implemented a [UART interface to the mmWave sensor](https://github.com/nicolasbrailo/ld2410s), with quite a lot of AI help to reverse engineer the protocol. I can now calibrate the sensor, which gives much better occupancy results. Moving the sensor to a D-Bus service also means I can replace it with a newer model, whenever I want to (quite likely never).

Finally, the Homeboard is now [integrated with my custom home automation service, ZMW](https://github.com/nicolasbrailo/zmw/tree/main/zmw_homeboard). This gives me a few new features, such as using the mmWave sensor in the homeboard as a presence sensor for home automation, controlling the slideshow from a Zigbee button, and using the display to announce things or show useful information, such as the price of cat food in today's spot market.

# End result

![](/blog_img/2026/0423_HomeboardN1_EndResult.jpg)

One final complication: after (re)building this new homeboard, I ended with 90% of the parts I need to build a 3rd Homeboard. Should I?


