# Projects and long-reads

@meta docType notAPost

# Open source projects

Sometimes I [decide to contribute something back to humanity](https://github.com/nicolasbrailo/). Others would say I unleash my crappy code to the world. In any case, here's something you can laugh at, be horrified about or maybe, maybe, find useful. The list is probably incomplete, out of date, or both. Some of these projects hail from the dark ages of the early 2000's, and may be woefully out of date.


## [Pianoli](https://github.com/nicolasbrailo/Pianoli)

>
> A baby game for Android
>
> Have a baby curious about shiny tablets and phones? Use this app as a baby-game and, more importantly, to prevent random taps of a baby from doing anything you may not want.
>
> This app will show a small piano a baby can use to explore sounds in a mobile device. At the same time, it will block any naive attempts at closing the app. The back, home and apps-menu buttons will be blocked, and Android's top menu won't be available. This ensures a baby can't accidentally close the game, preventing any actions on the device you may not want.
>


## [Spotiweb](https://github.com/nicolasbrailo/Spotiweb) - [Run in your browser](https://nicolasbrailo.github.io/SpotiWeb/)

> Alt web client for Spotify.
>
> If you find the native client for Spotify is too cluttered, SpotiWeb can provide a simpler experience. SpotiWeb automatically goes through the list of your followed artists to create an index groupped by category. The categories will be automatically determined based on the artists you follow. The result will be a simple web page with an index of all the artists you followed, groupped by somewhat logical categories.
>

## [MdLogGen](https://github.com/nicolasbrailo/MdlogGen)

This site is generated from a bunch of md files. A [sane person would use one of the many md to html enginges, but I wrote my own.](md_blog/2024/0225_MdlogGen.md)

> MdlogGen is a simple md-to-static-html, however it supports a few features I wasn't able to find elsewhere: comments, and site-search. MdlogGen depends on Github for these two features (or, rather, depends on the viewer to have a Github account to be able to use these two features).


## [RaspberryPi GPIO mon](https://github.com/nicolasbrailo/pi_gpio_mon)

A [small utility to monitor GPIO status in RaspberryPi](http://127.0.0.1:8000/blog/2024/0615_RaspberryPiGpioMon.html).

```
$ ./gpiomon -u -l 21
000 PIN 21 = >1<
009 PIN 21 = >0<
015 PIN 21 = >1<
```


## [VlcFreemote](https://github.com/nicolasbrailo/VlcFreemote) - [Link to article](md_blog/2016/0204_VLCFreemotenoneedtoleavethecouch.md)

>
> Control your VLC from an Android device. No need to get up from the couch.
>


## [ChromecasticSlideshow](https://github.com/nicolasbrailo/ChromecasticSlideshow)

Somehow still working after 10 years, [a good way to repurpose old Chromecasts you may have lying around](md_blog/2019/0405_ChromecasticSlideshow.md).

> Slideshows in Chromecast directly from your filesystem, without going through any online service. No Google Photos, Facebook or anything else: plain old random files straight from your disk to your Chromecast.


## [IMGeotagger](https://github.com/nicolasbrailo/IMGeotagger) - [Link to article](md_blog/2016/0128_OnthepoorstateofgeotaggingapplicationsforLinux.md)

>
> An image Geotagger for Linux that doesn't entirely suck.
> Will give you a pretty GUI with G. Maps, from which you can geo-tag a set of pictures.
>


## [TrippingSdCardPhotoManager](https://github.com/nicolasbrailo/TrippingSdCardPhotoManager) - [Link to article](md_blog/2015/0611_InowwriteAndroidappspresentingTrippingPhotoManager.md)

>
> When you're on a long trip and you don't want to carry around a heavy computer just to manage your camera's SD card, this app can be a helpful tool. Using your tablet's SD card reader (or an OTG cable, if it has none) you can manage the photos taken in your trip, preview your snaps and make room for more by deleting those that you don't want. Let's you use [ImageMagick](http://www.imagemagick.org/) in Android.
>


## [Godmin](https://github.com/nicolasbrailo/godmin) - [Setting up a Linux GW/Router, a guide for non network admins](md_blog/youfoundadeadlink.md)

>
> Godmin is intended as an application to \*easily administrate a Linux based gateway\*, but \*not as a one size fits all\* tool; Godmin was created with a very narrow audience in mind, it was created as a tool to easily administrate a Debian based gateway running ISC, bind and iptables, for a small to mid size LAN (10 to a 100 clients). You might find Godmin useful if you [...]
>


## [TrelloPrinter](https://github.com/nicolasbrailo/TrelloPrinter)

>
> Trello board printer: generate a printable version of a Trello board including card descriptions and attachments.
>


## [Hacked pictag](https://github.com/nicolasbrailo/pictag) - [Pictag: finally a simple geotagging tool for Linux](md_blog/2013/0801_PictagfinallyasimplegeotaggingtoolforLinux.md)

>
> A hacked clone of <https://launchpad.net/pictag> to have it run in newer Ubuntu versions
>


## [[Vim plugin] Impl Switcher : Easily switch between impl and header files](http://www.vim.org/scripts/script.php?script_id=5406)

>
> Impl Switcher: a Vim plaugin to switch between implementation and header files (for example, between .h and .cpp files).
>


## [[Vim plugin] BTN: Better tab new](http://www.vim.org/scripts/script.php?script_id=5405)

>
> Better tab new: replaces the default tabnew command with a slightly smarter version, capable of understanding line numbers. This is very useful for programming, where filenames are usually expressed as "fname:line number". Even when grepping, the output format will usualy be "path/to/file:42". BTN won't reject these strings, it will instead open them and move the cursor to the appropriate line.
>


## [Fastgrep](https://github.com/nicolasbrailo/Nico.rc/blob/master/fastgrep.sh) - [A cache for grep](md_blog/2012/1030_Fastgrepacacheforgrep.md)

>
> Feel your grep searches are too slow? Try caching your project for grep! Works great in combination with this [Vim plugin](https://github.com/nicolasbrailo/Nico.rc/blob/master/vim/plugins/findgrep.vim).
>



# Long form reads

This is a list of long-form articles I’ve written over the years which I am allowed to share publicly, and which do not always have an associated post in this blog. In many cases they are the presentations I used for courses or talks.

## Testing & mocking

* [Link a la presentación (PDF)](https://raw.githubusercontent.com/nicolasbrailo/powerpoint_monkey/master/testing/testing_mocking.pdf)* **Testing & mocking: C++**
* [Link a la presentación (PDF)](https://raw.githubusercontent.com/nicolasbrailo/powerpoint_monkey/master/cpp_testing/cpp_testing_mocking.pdf)* **Console Ninja: Cómo dejar de ser un usuario desconsolado**
* [Link a la presentación (PDF)](https://raw.githubusercontent.com/nicolasbrailo/powerpoint_monkey/master/bash_console_ninja/console_ninja.pdf)* **SQL FTW**
* [Link](https://raw.githubusercontent.com/nicolasbrailo/powerpoint_monkey/master/sql_intro/sql_ftw.pdf)* **Valgrind**
* [valgrind](https://raw.githubusercontent.com/nicolasbrailo/powerpoint_monkey/master/valgrind/valgrind.pdf)* **Notas sobre metodologís ágiles**
* [Introducción a las metodologías ágiles (spanish only)](https://raw.githubusercontent.com/nicolasbrailo/powerpoint_monkey/master/agile_methodologies_intro/metodologias_agiles.pdf)* **Introducion a GNU/Linux**
* [Link a la presentación (PDF)](https://raw.githubusercontent.com/nicolasbrailo/powerpoint_monkey/master/no_source/linux_survival_guide.pdf)* **GNU/Linux: Guía de Supervivencia (FLISOL 09)**
* [Link a la presentación (PDF)](https://raw.githubusercontent.com/nicolasbrailo/powerpoint_monkey/master/no_source/linux_survival_guide.pdf)* **LyX: A text editor that stays out of the way**
* URL: <http://debaday.debian.net/2008/01/20/lyx-a-text-editor-that-stays-out-of-the-way/>

---

# Long-format articles and presentations I've written over the years.

* [2009 LaTeX](md_blog/projects_texts/09latex.md)
* [2010 C++ Template metaprogramming](md_blog/projects_texts/10cpptemplates.md)
* [2011 C++0X features](md_blog/projects_texts/11c0xfeatures.md)
* [2011 Makefiles](md_blog/projects_texts/11makefiles.md)
* [2013 C++ exceptions under the hood](md_blog/projects_texts/13exceptionsunderthehood.md)
* [2013 C preprocessor](md_blog/projects_texts/13cpreprocessor.md)
* [2013 Setting up a Linux gateway/router, a guide for non network admins](md_blog/projects_texts/13linuxgwrouter.md)
* [2016 Writing Vim plugins](md_blog/projects_texts/16WritingVimplugins.md)
* [2024 Homeboard](md_blog/projects_texts/24homeboard.md)

