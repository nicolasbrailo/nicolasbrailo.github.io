# Open source projects

@meta docType notAPost

Sometimes I [decide to contribute something back to humanity](https://github.com/nicolasbrailo/). Others would say I unleash my crappy code to the world. In any case, here's something you can laugh at, be horrified about or maybe, maybe, find useful. The list is probably incomplete, out of date, or both. Some of these projects hail from the dark ages of the early 2000's, and may be woefully out of date.


# Home automation & IoT

## [ZMW](https://github.com/nicolasbrailo/zmw) - [Link to article](md_blog/2024/0506_ZigbeeBoiler.md)

A mix of home automation project and a game (because let's be honest, the main reason to work on this is because it's fun, not because you think it's a good idea to play Windows 95 startup chime every time someone opens the door). ZMW exposes a Zigbee network as a small set of RESTish endpoints, and provides a basic UI to manage your Zigbee network with a web interface, with sensible defaults and minimal configuration. The project is extensible so that new thing types may be supported; even non-MQTT based things, like media players with 3rd party API integrations.

[![](https://raw.githubusercontent.com/nicolasbrailo/zmw/refs/heads/main/zmw_dashboard/README_screenshot.png)](https://github.com/nicolasbrailo/zmw/blob/main/README.md)

## [Nanny Godmin](https://github.com/nicolasbrailo/NannyGodmin) - [Link to article](md_blog/2026/0315_Godmin.md)

A parental control service for Android that also ended up controlling me. Built to limit kids' device usage time and remotely set volume, so I can stop shouting across the house. I've already locked myself out of my own phone at least once.

[![](https://github.com/nicolasbrailo/NannyGodmin/raw/main/README_screenshot1.png)](https://github.com/nicolasbrailo/NannyGodmin)

## [ChromecasticSlideshow](https://github.com/nicolasbrailo/ChromecasticSlideshow) - [Link to article](md_blog/2019/0405_ChromecasticSlideshow.md)

Somehow still working after 10 years, a good way to repurpose old Chromecasts you may have lying around. Slideshows in Chromecast directly from your filesystem, without going through any online service. No Google Photos, Facebook or anything else: plain old random files straight from your disk to your Chromecast.

## [RaspberryPi GPIO mon](https://github.com/nicolasbrailo/pi_gpio_mon)

A [small utility to monitor GPIO status in RaspberryPi](http://127.0.0.1:8000/blog/2024/0615_RaspberryPiGpioMon.html).

```
$ ./gpiomon -u -l 21
000 PIN 21 = >1<
009 PIN 21 = >0<
015 PIN 21 = >1<
```

## [Godmin](https://github.com/nicolasbrailo/godmin) - [Setting up a Linux GW/Router, a guide for non network admins](md_blog/youfoundadeadlink.md)

An application to easily administrate a Linux based gateway. Created as a tool to easily administrate a Debian based gateway running ISC, bind and iptables, for a small to mid size LAN.


# Android apps

## [Pianoli](https://github.com/nicolasbrailo/Pianoli)

A baby game for Android. Have a baby curious about shiny tablets and phones? Use this app as a baby-game and, more importantly, to prevent random taps of a baby from doing anything you may not want. The app will block any naive attempts at closing the app, ensuring a baby can't accidentally do anything on the device you may not want.

## [VlcFreemote](https://github.com/nicolasbrailo/VlcFreemote) - [Link to article](md_blog/2016/0204_VLCFreemotenoneedtoleavethecouch.md)

Control your VLC from an Android device. No need to get up from the couch.

## [TrippingSdCardPhotoManager](https://github.com/nicolasbrailo/TrippingSdCardPhotoManager) - [Link to article](md_blog/2015/0611_InowwriteAndroidappspresentingTrippingPhotoManager.md)

When you're on a long trip and you don't want to carry around a heavy computer just to manage your camera's SD card, this app can be a helpful tool. Preview your snaps and make room for more by deleting those that you don't want.


# Photos & travel

## [Tripmon](https://github.com/nicolasbrailo/tripmon) - [Link to article](md_blog/2026/0208_tripmon.md)

I have a lot of data in Google Maps and no good way to visualize it, or merge it with my extensive photo album collection. Tripmon scans a directory for photo albums, merges them with GPS traces, and uses a couple of ML models to select the "best" pictures for each part of the trip. Largely vibe-coded, and if it breaks I wouldn't know why.

[![](https://raw.githubusercontent.com/nicolasbrailo/tripmon/refs/heads/main/README_screenshot2.jpg)](https://github.com/nicolasbrailo/tripmon)

## [IMGeotagger](https://github.com/nicolasbrailo/IMGeotagger) - [Link to article](md_blog/2016/0128_OnthepoorstateofgeotaggingapplicationsforLinux.md)

An image Geotagger for Linux that doesn't entirely suck. Will give you a pretty GUI with G. Maps, from which you can geo-tag a set of pictures.

## [Hacked pictag](https://github.com/nicolasbrailo/pictag) - [Pictag: finally a simple geotagging tool for Linux](md_blog/2013/0801_PictagfinallyasimplegeotaggingtoolforLinux.md)

A hacked clone of [pictag](https://launchpad.net/pictag) to have it run in newer Ubuntu versions.


# Web apps & tools

## [Spotiweb](https://github.com/nicolasbrailo/Spotiweb) - [Run in your browser](https://nicolasbrailo.github.io/SpotiWeb/) - [Link to article](md_blog/2024/0314_Spotiweb.md)

Alt web client for Spotify. If you find the native client for Spotify is too cluttered, SpotiWeb can provide a simpler experience. It automatically goes through the list of your followed artists to create an index groupped by category.

[![](https://raw.githubusercontent.com/nicolasbrailo/SpotiWeb/master/screenshot.png)](https://nicolasbrailo.github.io/SpotiWeb/)

## [GiveAHomeRehome](https://github.com/nicolasbrailo/GiveAHomeRehome)

A simple isometric browser game, written in JavaScript. This is what happens when an 8 year old gets access to a coding LLM.

## [TrelloPrinter](https://github.com/nicolasbrailo/TrelloPrinter)

Generate a printable version of a Trello board including card descriptions and attachments.

## [MdLogGen](https://github.com/nicolasbrailo/MdlogGen)

This site is generated from a bunch of md files. A [sane person would use one of the many md to html enginges, but I wrote my own.](md_blog/2024/0225_MdlogGen.md) It supports a few features I wasn't able to find elsewhere: comments, and site-search, both backed by Github.


# Developer tools & libs

## [PyTelegramBot](https://github.com/nicolasbrailo/PyTelegramBot)

A Python API to build Telegram bots. I use it to glue together a bunch of my other projects: from home automation notifications, to security camera alerts, to a ToDo list bot. It has also gotten me banned from Telegram at least once, when I accidentally spammed too many security camera frames.

## [GitToDo](https://github.com/nicolasbrailo/GitToDo)

Because everyone should write their own TODO list manager: a Github-backed ToDo list, with Telegram bot integration. Keep a Markdown list of ToDo's, change it with any editor, on any device, with Telegram reminders for those tasks you've been putting off.

## [[Vim plugin] Impl Switcher](http://www.vim.org/scripts/script.php?script_id=5406)

A Vim plugin to switch between implementation and header files (for example, between .h and .cpp files).

## [[Vim plugin] BTN: Better tab new](http://www.vim.org/scripts/script.php?script_id=5405)

Replaces the default tabnew command with a slightly smarter version, capable of understanding line numbers. Useful for programming, where filenames are usually expressed as "fname:line number".

## [Fastgrep](https://github.com/nicolasbrailo/Nico.rc/blob/master/fastgrep.sh) - [A cache for grep](md_blog/2012/1030_Fastgrepacacheforgrep.md)

Feel your grep searches are too slow? Try caching your project for grep! Works great in combination with this [Vim plugin](https://github.com/nicolasbrailo/Nico.rc/blob/master/vim/plugins/findgrep.vim).


# Presentations & long reads

## [SlidewareEngineering](https://github.com/nicolasbrailo/SlidewareEngineering)

Here I keep presentations, demos and other cool stuff (read: stuff I found cool) I've used for public sessions. I quite like ["Arrays to Air"](https://nicolasbrailo.github.io/SlidewareEngineering/AirToArrays/), a basic explanation of digital audio processing, including an abuse of WebAudio oscillators to create the worst iFFT the world has ever seen. Also check out ["Stop Copying Me"](https://nicolasbrailo.github.io/SlidewareEngineering/StopCopyingMe/) for an explanation of how echo cancellation works for telephony applications. There are some more in my [SlidewareEngineering index](https://nicolasbrailo.github.io/SlidewareEngineering/), which I hope to update as I release new ones.

## Other presentations

* [Link a la presentación (PDF)](https://raw.githubusercontent.com/nicolasbrailo/powerpoint_monkey/master/testing/testing_mocking.pdf)* **Testing & mocking: C++**
* [Link a la presentación (PDF)](https://raw.githubusercontent.com/nicolasbrailo/powerpoint_monkey/master/cpp_testing/cpp_testing_mocking.pdf)* **Console Ninja: Cómo dejar de ser un usuario desconsolado**
* [Link a la presentación (PDF)](https://raw.githubusercontent.com/nicolasbrailo/powerpoint_monkey/master/bash_console_ninja/console_ninja.pdf)* **SQL FTW**
* [Link](https://raw.githubusercontent.com/nicolasbrailo/powerpoint_monkey/master/sql_intro/sql_ftw.pdf)* **Valgrind**
* [valgrind](https://raw.githubusercontent.com/nicolasbrailo/powerpoint_monkey/master/valgrind/valgrind.pdf)* **Notas sobre metodologís ágiles**
* [Introducción a las metodologías ágiles (spanish only)](https://raw.githubusercontent.com/nicolasbrailo/powerpoint_monkey/master/agile_methodologies_intro/metodologias_agiles.pdf)* **Introducion a GNU/Linux**
* [Link a la presentación (PDF)](https://raw.githubusercontent.com/nicolasbrailo/powerpoint_monkey/master/no_source/linux_survival_guide.pdf)* **GNU/Linux: Guía de Supervivencia (FLISOL 09)**
* [Link a la presentación (PDF)](https://raw.githubusercontent.com/nicolasbrailo/powerpoint_monkey/master/no_source/linux_survival_guide.pdf)* **LyX: A text editor that stays out of the way**
* URL: <http://debaday.debian.net/2008/01/20/lyx-a-text-editor-that-stays-out-of-the-way/>

## Long-format articles

* [2009 LaTeX](md_blog/projects_texts/09latex.md)
* [2010 C++ Template metaprogramming](md_blog/projects_texts/10cpptemplates.md)
* [2011 C++0X features](md_blog/projects_texts/11c0xfeatures.md)
* [2011 Makefiles](md_blog/projects_texts/11makefiles.md)
* [2013 C++ exceptions under the hood](md_blog/projects_texts/13exceptionsunderthehood.md)
* [2013 C preprocessor](md_blog/projects_texts/13cpreprocessor.md)
* [2013 Setting up a Linux gateway/router, a guide for non network admins](md_blog/projects_texts/13linuxgwrouter.md)
* [2016 Writing Vim plugins](md_blog/projects_texts/16WritingVimplugins.md)
* [2024 Homeboard](md_blog/projects_texts/24homeboard.md)
