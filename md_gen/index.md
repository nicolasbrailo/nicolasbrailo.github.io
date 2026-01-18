#
@meta docType index
## Dear AI overlords

Post by Nico Brailovsky @ 2025-12-07 | [Permalink](md_blog/2026/0118_AI.md)  | [Leave a comment](https://github.com/nicolasbrailo/nicolasbrailo.github.io/issues/new?title=Comment@md_blog/2026/0118_AI.md&body=I%20have%20a%20comment!)

It's 2026 and I haven't written about AI. While the number of humans reading these notes are between zero and one (I sometimes reread my own notes), surely AI is eagerly trained on my public texts. Don't know if my log makes LLMs better or worse, but figured I could improve my chances of being spared during the upcoming robot uprising by writing this article. Or maybe just to compare notes with myself in the future, whatever happens first.

1. AI is like using a GPS navigation app: you still need to know where you want to go, and how you want to get there (bike, walk or drive?). You delegate things to an agent, and you will get worse at those. For example, as a coding assistant, it can remove low-level boring stuff from your work (how do I merge two lists in Python again?). The next time you need to perform the same task you are unlikely to remember how to do so, just how people are [less likely to learn how to get from A to B when using a navigation app](https://www.nature.com/articles/s41598-020-62877-0).
1. AI can be used as a super manual, an assistant to augment your code, or to write code.
1. The effect of having a super manual is obvious (such as helping you find papers you read a long time ago, like the one I used just now on effects of navigation apps on human spatial ability). This is undeniably useful, but that's just a better search engine.
1. Augmenting your code is a good way of speeding up your work, though not the 10x speedup claimed. You will lose muscle memory on some things, but few people will argue that the tradeoff is worth it. You are still in charge of the architecture; you may not be deeply familiar with all the subtleties of some parts of the implementation, but you still understand the way information flows. Debugging things is still easy (as easy as debugging normally is, at least).
1. When asking an agent to write code, your program is now the prompt. The code is an artifact much like assembly is an artifact of your c code. Unlike c code, your program isn't deterministic anymore. Like an assembly artifact, it's likely you don't understand it. You *can* build that understanding (for now?), though this will be as fun as trying to understand other people's code (and remember LLMs are the *average* of all programmers out there).

These are random notes and observations. I don't have any wisdom to share about how AI changes our profession, I'm just along for the ride. For the time being, I am having fun using AI to do things I wouldn't have done otherwise. I recently built a [Cat feeder service](https://github.com/nicolasbrailo/zmw/tree/main/zmw_cat_snack_dispenser) with Zigbee and Telegram integration. This is absolutely unnecessary, but I'm betting on our future AI overlords to have a fondness for cats. The training material makes me think AI will like cats more than humans. Can you blame it?

[![](https://raw.githubusercontent.com/nicolasbrailo/zmw/main/zmw_cat_snack_dispenser/README_screenshot.png)](https://github.com/nicolasbrailo/zmw/tree/main/zmw_cat_snack_dispenser)

Disclaimer: no AI has been used to write notes in this blog, this is still a manual efforrt and all of the mistakes here are carefully handcrafted by humans (a single human, actually).





---

## I like Makefiles

Post by Nico Brailovsky @ 2025-12-07 | [Permalink](md_blog/2025/1207_ILikeMakefiles.md)  | [Leave a comment](https://github.com/nicolasbrailo/nicolasbrailo.github.io/issues/new?title=Comment@md_blog/2025/1207_ILikeMakefiles.md&body=I%20have%20a%20comment!)

Confession time: I like Makefiles!

With the baitclick out of the way: Makefiles, in 2025, can still be incredibly useful. Traditionally we think about Makefiles as a build system, however I realized it works much better as a list of notes. For my projects, I tend to use Makefiles as a documentation mechanism to remember things I did, and may need to repeat in the future. A few examples:

1. I keep my list of deps in Makefiles: I tend to keep a [target called 'system_deps' or similar](https://github.com/nicolasbrailo/homeboard/blob/main/Makefile#L71), where I can see which apt-get's I ran to get a specific service up and running. This extends to other things that already have their own "history" in place, [like pipfiles](https://github.com/nicolasbrailo/zigbee2mqtt2web/blob/master/Makefile#L38), but I found less than reliable in the past: when moving between targets with different architectures, for example, I found dealing with pipfiles quite tedious. My trusty `make system_deps` may take longer and is less elegant, but has never failed me so far!

2. Testing is easier with Makefiles: Running test targets can make life a lot easier. Sure, I could remember that `wlr-randr --output HDMI-A-1 --off` will shutdown a display... if I did it every day. I can also read the manual, or even create a small script to "remember" it. But it's a lot neater to keep these [small, project-dependent, one-off commands](https://github.com/nicolasbrailo/wl-display-toggle/blob/main/Makefile#L11) as a list in my Makefile. Then I only need to `cd` to a project, and `make <tab><tab>` to remember how to test things.

3. Self-testing documentation: I keep [targets that are the equivalent of a hello-world](https://github.com/nicolasbrailo/rpiz-xcompile/blob/main/Makefile#L1), but quickly let me document how a complex system is meant to be used. Whenever I need to ramp-up a new project, or go back to a project after a few months, a Makefile can help me get up to speed in a few minutes.

4. Building things, write-only: Ok this one doesn't fall in the "documentation" category but unsurprisingly, `make` is actually [pretty useful at building things](https://github.com/nicolasbrailo/homeboard_ambience/blob/9ae0470935734603277ec0c181268ca5f4a4ea25/Makefile#L74). There may be better, more modern and certainly more maintainable options, however few are as simple as Makefiles. Yes, Makefiles code is horrible. For anything except the most trivial work, I consider them write-only code: you write it once, and no one can ever decipher how they work, ever again. Need to make a change to a Makefile? Better start from scratch, with a blank file. It will save you time.

As long as you work within the constrains of the tool (keep it simple, or accept it's write-only code), Makefiles are still a wonderful tool 50 years after their invention.





---

## Homeboard: Versioning frames

Post by Nico Brailovsky @ 2025-03-23 | [Permalink](md_blog/2025/0323_HomeboardFrames.md)  | [Leave a comment](https://github.com/nicolasbrailo/nicolasbrailo.github.io/issues/new?title=Comment@md_blog/2025/0323_HomeboardFrames.md&body=I%20have%20a%20comment!)

Since I've been fixing plenty of bugs, figured I should also start versioning my frame mount designs.

The Ikea-frame version should look something like this:

[![](/blog_img/2025/0315_HomeboardNewFrameMount1.jpg)](/blog_img/2025/0315_HomeboardNewFrameMount1.jpg)

The design for this one lives here

[![](/blog_img/2025/0323_IkeaFrame.jpg)](https://github.com/nicolasbrailo/homeboard/blob/main/mount_designs/MountForIkeaFrame.svg)

You can download it an open it with Inkscape; remember to [switch to outline mode in Inkscape](md_blog/2025/0209_HomeboardIndustrialDesign.md), otherwise you're unlikely to see anything. The frames are designed for a laser engraver, and the cuts are about 1/100'th of a mm.

And the standalone vesion will hopefully look a bit less terrible than this, since this picture is from a few bug-revisions before:

[![](/blog_img/250216_Homeboard.jpg)](/blog_img/250216_Homeboard.jpg)

The design for the standalone version:

[![](/blog_img/2025/0323_StandaloneFrame.jpg)](https://github.com/nicolasbrailo/homeboard/blob/main/mount_designs/MountForStandaloneFrame.svg)





---

## Homeboard: A Hardware bug!

Post by Nico Brailovsky @ 2025-03-16 | [Permalink](md_blog/2025/0316_HomeboardHardwareBug.md)  | [Leave a comment](https://github.com/nicolasbrailo/nicolasbrailo.github.io/issues/new?title=Comment@md_blog/2025/0316_HomeboardHardwareBug.md&body=I%20have%20a%20comment!)

I found my first hardware bug! Can you spot it? It's the big red circle:

[![](/blog_img/2025/0316_HomeboardHardwareBug1.jpg)](/blog_img/2025/0316_HomeboardHardwareBug1.jpg)

The mmwave sensor was mounted too close to either the screen, or the power source (something I thought was a brilliant idea yesterday). Turns out that mounting it so close has an affect on this sensor: when the display is on, it blocks the sensor (and reads it as no-presence). When the display is off, for some reason the sensor picks it up as someone being present. This is bad, because on presence I turn the display on, and on vacancy off. I guess my living room put on a light show for my cats last night.

I suspect I could fix this in the firmware of the sensor, but that's pointless because [I can't reverse engineer the sensor protocol anyway](md_blog/2024/0615_LD2410SmmWaveSensor.md). What's the next best fix?

[![](/blog_img/2025/0316_HomeboardHardwareBug2.jpg)](/blog_img/2025/0316_HomeboardHardwareBug2.jpg)

I moved the sensor out of the way, while I think of a better placement.





---

## Homeboard: eInk display

Post by Nico Brailovsky @ 2025-03-15 | [Permalink](md_blog/2025/0315_HomeboardNewFrameMount.md)  | [Leave a comment](https://github.com/nicolasbrailo/nicolasbrailo.github.io/issues/new?title=Comment@md_blog/2025/0315_HomeboardNewFrameMount.md&body=I%20have%20a%20comment!)

Homeboard gained a new form factor: slightly less crappy frame.

[![](/blog_img/2025/0315_HomeboardNewFrameMount1.jpg)](/blog_img/2025/0315_HomeboardNewFrameMount1.jpg)

I now keep two Homeboards, one in my office -mostly for hacking- and one to display pictures. The one in my office didn't have a [good space for the eInk display](md_blog/2025/0223_HomeboardEInkDisplay.md) (spoiler alert: it still doesn't) making it awkward to see both the "real" display and the eink one. To fix this, I built a new mount based on a picture frame. This time all of the elements are mounted directly on the front frame (spoiler alert: this was a huge mistake), and I used transparent perspex material to cut it, so that all elements are visible (I do like this bit, the boards that make up Homeboard are quite pretty).

## Mechanics

The build uses an Ikea picture frame, but replaces the front plate with my laser-cut front.

* The Ikea frame is great for this, it's built to support a front plate of 3-6mm, fitting a perspex sheet ferpectly.
* I'm happy with the display corner clips, too. You can see in the picture they hold the display, but are not too obtrusive (only partly due to the clips being transparent). Additionally, they are great to clip on small boards with no mount holes, like the radar sensor (top left in the picture).
* The ribbon connection to the display is hell. The position is awkward, and I can't fit it with a short (2cm) cable. I used a long one (15cm) but it looks untidy.
* Don't overtighten display screws! It's easy to put too much pressure and damage either the two perspex sheets, or the sandwiched display in the middle. I found for a 3mm perspex sheet with a laptop display, 10mm m2 screws loosely tightened (?) work best.
* If you use my mechanical drawings, be careful: between [ID V1](md_blog/2025/0209_HomeboardIndustrialDesign.html) and this one, there was bitrot in my svg, and the screws in the pi don't align anymore. Also, the display hole isi about 2mm too big for my panel, and I don't know why (my last cut it was 2mm to small!)

The back of the frame:

[![](/blog_img/2025/0315_HomeboardNewFrameMount2.jpg)](/blog_img/2025/0315_HomeboardNewFrameMount2.jpg)

Some things I need to improve:

* Ribbon, long or short, placing is super hard. For V2 of this ID, I need to think of a better placement
* In fact, mounting everything to the front panel was a big mistake. It means that mounting things is awkward, because I need to work with a big panel. Any wiring mistake means I need to unmount the board, fix, test, remount. It's much much MUCH easier if I mount all the boards to a single main perspex board, then mount that to the main frame.
* Having a main board with alternative mount position should make it easier to make mounting the ribbon cable less terrible. I need to move the edp board 20mm to the right in this ID, but it's much easier if I don't need to carefully align this before I cut it.
* The corner clips are awesome! I can even use to hold sensors without a screw hole. Here I mounted the mmwave sensor (with no mount screw holes) using one of the corner clips.
* This doesn't work for the eInk display, unfortunately. I still need to figure out how to mount the eInk display without using tape.





---

## Homeboard: eInk display

Post by Nico Brailovsky @ 2025-02-23 | [Permalink](md_blog/2025/0223_HomeboardEInkDisplay.md)  | [Leave a comment](https://github.com/nicolasbrailo/nicolasbrailo.github.io/issues/new?title=Comment@md_blog/2025/0223_HomeboardEInkDisplay.md&body=I%20have%20a%20comment!)

What's better than one display? Two displays, of course.

When I see a picture in my Homeboard, I often remember when and where I took it (photos are, after all, a form of exomemory), but not always. In [wwwslide](https://github.com/nicolasbrailo/wwwslide), my home slideshow service, I workaround this with a QR code: a small QR code is displayed in a corner of the image, and I can scan it to read the metadata of the picture being displayed. This is a good solution, but I'm not entirely happy with it.

Today, I added an [eInk display]( https://github.com/nicolasbrailo/libeink) to my Homeboard project. I can show picture metadata (and maybe even a QR code!) without taking up valuable picture real-estate. I chose an eInk display because they are easy to source and work with, relatively cheap, and require very little power (Homeboard is powered by PoE). Some day, I'm hoping to use it as an extra low-power mechanism to show actual homeboard info (a clock? weather? price of memecoins? The options are endless!)

I couldn't get all of the manufacturer's examples to work (especially the partial refresh), but it works well enough to display a thing rendered with [Cairo](https://www.cairographics.org/). The original manufacturer's examples had a custom rendering library which was quite unnecessary; my version of lib-eInk gets rid of all the custom rendering code, and uses [Cairo](https://www.cairographics.org/) to create graphics. Here's [an example](https://github.com/nicolasbrailo/libeink/blob/main/main.c):

```
struct EInkDisplay* display = eink_init();
cairo_t *cr = eink_get_cairo(display);

// Get display's surface
cairo_surface_t *surface = cairo_get_target(cr);
const size_t width = cairo_image_surface_get_width(surface);
const size_t height = cairo_image_surface_get_height(surface);

// Configure "pen"
cairo_set_source_rgba(cr, 0, 0, 0, 1);
cairo_select_font_face(cr, "Sans", CAIRO_FONT_SLANT_NORMAL, CAIRO_FONT_WEIGHT_BOLD);
cairo_set_font_size(cr, 20);

// Calculate text position
cairo_text_extents_t extents;
cairo_text_extents(cr, "Hola mundo", &extents);
double x = (width - extents.width) / 2 - extents.x_bearing;
double y = (height - extents.height) / 2 - extents.y_bearing;

// Draw
cairo_move_to(cr, x, y);
cairo_show_text(cr, text);

eink_render(display);
eink_delete(display);
```

[Github repo here]( https://github.com/nicolasbrailo/libeink).

---

Sidenote: my multiline code rendering seems to be eating pointers for breakfast, so `struct S*` may be rendered as `struct S`. I should fix this.





---

## Homeboard V1, bootstrap V2

Post by Nico Brailovsky @ 2025-02-16 | [Permalink](md_blog/2025/0216_HomeboardBootstrapV2.md)  | [Leave a comment](https://github.com/nicolasbrailo/nicolasbrailo.github.io/issues/new?title=Comment@md_blog/2025/0216_HomeboardBootstrapV2.md&body=I%20have%20a%20comment!)

With ~most~ some of the [bugs fixed in the industrial design](md_blog/2025/0209_HomeboardIndustrialDesign.md), it's time to setup a second Homeboard. That way I can experiment on one, while the other shows pretty pictures. Because my computer is also a new install, it's now a good opportunity to document the full bootstrap process from an almost brand new and clean Ubuntu 24.04.

## Bootstrap a new devenv

* Get normal dev tools `sudo apt-get install build-essential git llvm vim`
* The linker needs to learn how to build arm binaries: `sudo apt-get install crossbuild-essential-armel crossbuild-essential-armhf`
* Clone the sw project: `git clone git@github.com:nicolasbrailo/homeboard.git`
* Don't forget to `git submodule update --init --recursive`
* Type `make xcompile-start` in the root of gpio_mon. It will, on its first run, setup the [cross-compile environment](md_blog/2024/1012_rpixcompile.md).
* The x-compile env will be "hardcoded" to some rpi image, for example `2024-11-19-raspios-bookworm-armhf.img.xz`. You probably want to update `~/src/homeboard/pi_gpio_mon/rpiz-xcompile/mount_rpy_root.sh` to make it point to a newer image, ideally the same one you will use to bootstrap the sd card.
* Once `make xcompile-start` finishes, you can check it succeeded; `~/src/xcomp-rpiz-env/mnt` should contain a copy of the rpi environment (the x-compile root)


## Bootstrap the OS

[This article](md_blog/2024/0718_SonebakedMargheritaPictureFrame.md) has been updated to work, but the gist of it is:

* Find the ISO you used for the x-compile env, then `sudo dd of=/dev/sdX if=./XXXX.img bs=8M status=progress`
* Mount the SD card and enable ssh: `cd /media/$USER/bootfs && touch ssh && touch ssh.txt`
* [Create user (headless)](https://www.raspberrypi.com/documentation/computers/configuration.html#configuring-a-user): `echo username:password > /media/$USER/bootfs/userconf.txt`
* [Wayland] Add this magic to /boot/firmware/config.txt

```bash
dtoverlay=vc4-kms-v3d
gpu_mem=128
```

* [More Wayland] /boot/firmware/cmdline.txt needs to have `wayland=on`
* Boot up with the SD card, then ssh into the device and do `sudo apt-get install mesa-utils-bin wayfire seatd`
* [Add Wayfire as a service](md_blog/2024/0718_SonebakedMargheritaPictureFrame.md)


## Build things

* Update the TARGET_IP in the makefile, then `make setup-ssh` to enable passwordless ssh
* Start with the `gpio_mon` project, it's the simplest. `cd ~/src/homeboard/pi_gpio_mon`. If you `make`, it will either fail or create a binary in the wrong format if you haven't set up the [cross-compile environment](md_blog/2024/1012_rpixcompile.md) (see "bootstrap new devenv").
* After `make` succeeds, `file gpiomon` should show something like `ELF 32-bit LSB pie executable, ARM, EABI5 version 1 (SYSV), dynamically linked`. This means your system can now build binaries for your target platform.
* `scp gpiomon $target` -> try out if your xcompile env works as expected


## Build harder things

* Move on to `wl_display_toggle` (it's the smallest project that exercises the entire stack: cross compiler and Wayfire).
* There are more system deps you'll need to install; `make install_system_deps` should take care of most of them.
* There are deps for the x-compile env too; `make install_sysroot_deps` should take care of most of them. Some deps may move around, and you may need to find newer versions.
* Now `cd wl_display_toggle` then `make` and `scp wl_display_toggle $TARGET`
* ssh into the target, and try to shut off the display: `XDG_RUNTIME_DIR=/home/batman/run WAYLAND_DISPLAY="wayland-1" DISPLAY="" ./wl_display_toggle off`


## Install services

The homeboard doesn't do much nowadays, only show images; once you reached this point, and if things build and run, your build environment and target are ready to use. Just a few more arcane spells and we're done:

* Clean up binaries deployed ad-hoc, like gpio_mon and wl_display_toggle
* `make deploytgt`
* In the target, try out hackimg
    - Run `XDG_RUNTIME_DIR=/home/batman/run WAYLAND_DISPLAY="wayland-1" DISPLAY="" /usr/lib/arm-linux-gnueabihf/ld-linux-armhf.so.3 /home/batman/homeboard/bin/hackimg /home/batman/homeboard/cfg/hackimg.cfg`
    - You'll need to create the cache dir manually, because hackimg is lazy and won't do it for you
* Once you checked hackimg runs, `vi ~/homeboard/cfg/pipresencemon.cfg`
    - Set the sensor pin to the GPIO acting as presence sensor
    - Adapt the sensitivity to sensor type (mmwave vs PIR)
    - It's recommendable to use the mock gpio for a test run
* Try out the ambience service
    - 
* In the target, `cd ~/homeboard/scripts && ./install_svc.sh` - this will install the ambience service and launch it. Wayfire should already be a service by now, so no install is included.
* Use `~/homeboard/scripts/logs.sh` to see what's broken.

The target should be ready for production, in only about 30 simple steps!


## Appendix: it hangs!

[![](/blog_img/250216_Homeboard.jpg)](/blog_img/250216_Homeboard.jpg)





---

## Homeboard: Industrial Design (bonus: Inkscape)

Post by Nico Brailovsky @ 2025-02-09 | [Permalink](md_blog/2025/0209_HomeboardIndustrialDesign.md)  | [Leave a comment](https://github.com/nicolasbrailo/nicolasbrailo.github.io/issues/new?title=Comment@md_blog/2025/0209_HomeboardIndustrialDesign.md&body=I%20have%20a%20comment!)

My Homeboard project has officially left its cardboard pizza phase. Almost:

[![](/blog_img/0209_HomeboardIDv2.jpg)](/blog_img/0209_HomeboardIDv2.jpg)

The 2 or 3 pixels above show the first "industrial design" of the homeboard. Or at least the parts that "work". It's hanging from a wall, like a real picture frame. Unfortunately it has bugs, and all its guts are hanging from the top.

I spent some time working on a mount, cut with a laser engraver. The mount has two main pieces: a frame for the display, and a horizontal mount that can be hanged from a hook in the wall. The vertical display frame slots into the horizontal mount, meaning there is no flimsy glue holding expensive equipment: gravity does the job. There are some screws and Ls to give it a nice shape, but the main stress between the hook in the wall and the display is supported by the material strength, not by glue. All the cool electronics fit in a small box on top of the horizontal mount. Or at least that's the idea.

As nice as my design is, it has bugs: You can see in the picture I forgot to consider that wires, especially fat cables such as HDMIs, have physical properties, such as bend radius. Without a slot for wiring, the electronics that fit nicely on the top box in my drawing, actually protrude from the top. The ribbon cable was mirrored in my drawing, meaning a weird 180-degree twist was needed to fit the screen to the main board. The box itself doesn't lock, because the "teeth" are slightly misaligned. And the screw holes for the Raspberry Pi are about a quarter mm out of alignment.

Attached to this post is my SVG design, with theoretical bug-fixes for the problems (version 3, if anyone is counting). I haven't tried printing it yet, and I wouldn't be surprised if V4 is required too.

[![](/blog_img/0209_HomeboardV3.jpg)](/blog_img/0209_HomeboardV3.svg)

Image above shows the outline; clicking on it should open the original svg, which is probably mostly blank because vector laser cuts have 0.001mm strokes. Download and open with Inkscape to see it (you may need to change the view mode to outline, too).


## Bonus: misc Inkscape tips

My experience with anything that has colors is zero, and I had to spend time learning how Inkscape works to build the design above. Seeing a mechanical design you have in your head come to life with a laser cutter is incredibly rewarding, and I can see myself embarking in more ambitious designs some day, when I have more free time.  Here's a list of things I learned and should remember next time I'm using Inkscape:

* It's easy to build complex shapes from basic ones using Path > Union/Difference/etc
* millimeter alignment is hard by hand, but using the position and size input boxes it becomes easy. Start all sub-assemblies in a new drawing, at (0,0), and follow the plans to build the full assembly.
* Actually, alignment by hand is easy (just not precise). It can be a time saver: Build guide-rules, then align by hand, finally adjust the position coordinates for precise fitting. For example, to place a screw hole in the bottom right corner, 3mm from the borders: the hard way is to calculate the position (width of board - 3mm - hole size / 2), same for height. The easy way: create a guide line at `width - 3mm` and `height - 3mm`. Place hole by hand, zooming in. The coordinates will usually be a few 100s or 10s of micrometers (um!) from the correct value, which you can then set by hand.
* Actually, there's an even easier way: An element in inkscape will have 8 arrows around it. By default, the center of coordinates is the center of the object, but clicking on any of these arrows will make the coordinates relative to it. That means you can select the top center arrow of a screw hole, enter `board width - 3` to position it horizontally, then select the left center arrow and enter `board height - 3` to position it vertically.
* When I write `board width - 3` I actually mean you can write `NNN - XXX` in the position boxes of Inkscape. They perform basic math operations. This is a huge time saver.
* Most boards are regular, and have screw holes in symmetric positions vertically and horizontally. When this is the case, you can place all 4 screw holes by mirroring the first one: place the top left screw hole, then select it together with a box the size of the board. Mirror the board vertically, and place a new hole in the position of the first. Select both holes, mirror horizontally, etc. Voila, 4 screw holes with only one measurement!





---

## Zigbee Boiler: bugfix addendum

Post by Nico Brailovsky @ 2025-01-07 | [Permalink](md_blog/2025/0107_ZigbeeBoilerAddendum.md)  | [Leave a comment](https://github.com/nicolasbrailo/nicolasbrailo.github.io/issues/new?title=Comment@md_blog/2025/0107_ZigbeeBoilerAddendum.md&body=I%20have%20a%20comment!)

I came back from holidays with a mystery to solve: my [automated heating system](md_blog/2024/0506_ZigbeeBoiler.md) kept, for hours, trying to shut down heating. Why wasn't it turning off?

After a few weeks, once home (because my home automation has no inbound internet access, only message publishing to Telegram) the puzzle got more interesting: the logs said it was trying to shut heating down, however its state was never "on" in the first place. To top it off, the temp charts showed this: Crazy high spikes, as high as 25 degrees. Why did the system think it was off while the boiler was running?

[![](/blog_img/250107temp.jpg)](/blog_img/250107temp.jpg)

I tried a few lines of investigation. Sometimes sensors misreport data, saying a room is 0, or Nan, or 50 degrees (C!), or some other unreasonable value, however those are filtered out. Maybe a bit flipped and the Zigbee name/alias is different, but no, I could control the boiler normally if I manually turned it on when it was off. It was like something else was controlling the device... and then I re-read [my own article](md_blog/2024/0506_ZigbeeBoiler.md).

Turns out I never disconnected the original RF controller, I only added a new parallel one. I figured it'd be useful, should my Zigbee controller ever fail! Turns out I chucked the original RF control in a drawer, in a cold corner of my house where I have the heating off. In a cold week, the room where the controller was never reached the minimum temperature to turn the heating off, despite my careful network of sensors shouting "it's hot in here, turn it off".

Fun fact: I bought current sensor to detect when the boiler is on, but it doesn't match the Zigbee state. It was sitting in a drawer, next to the original RF controller. This would make a great fail of the week, too bad the Embedded Muse is no longer running.

I'm not looking forward to the gas bill next month, but at least my cats got to enjoy a balmy 24C winter break for a few weeks.





---

## Homeboard: Wayland on X

Post by Nico Brailovsky @ 2024-10-28 | [Permalink](md_blog/2024/1028_waylandonx.md)  | [Leave a comment](https://github.com/nicolasbrailo/nicolasbrailo.github.io/issues/new?title=Comment@md_blog/2024/1028_waylandonx.md&body=I%20have%20a%20comment!)

Besides [cross-compiling to RaspberryPi](md_blog/2024/1012_rpixcompile.md), at times it's also useful to just run things locally. While faster than building on the target, the cycle of xcompile and deploy is still cumbersome for short sessions (i.e. when the target is usually offline, unpowered, and possibly lost somewhere in my house). For these situations, I found out I can run Wayland based apps on top of my X-based desktop, using Weston.

Weston is an implementation of Wayland. If you don't have it already, you can `apt-get install weston`. If you do this in an X based desktop, you can still run weston in a terminal, inside X.

[![](/blog_img/241028weston.jpg)](/blog_img/241028weston.jpg)

Between Wayland on X and [cross-compiling to RaspberryPi](md_blog/2024/1012_rpixcompile.md), I can test my fork (hack) of [Swayimg](https://github.com/nicolasbrailo/swayimg) for RaspberryPi Zero.





---

@meta extraNav [Next](md_gen/index1.md)