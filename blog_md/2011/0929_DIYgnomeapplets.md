# DIY gnome applets

@meta publishDatetime 2011-09-29T09:00:00.000+02:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2011/09/diy-gnome-applets.html

We all know Gnome, and similar GUIs, are there only as a fancy console multiplexer, but even so it's useful to have widgets in your menus or dockbars to display useful data, like the release date of DNF (\*). Gnome has a limited amount of applets from which you can choose, and most of them are crap or limited in their customization. You can always create your own widgets, but that's a pain in the ass for lazy people like me. Fortunately we lazy people can now use something an order of magnitude more useful than widgets in Gnome : we can use console commands!

Using something called [Compa](http://code.google.com/p/compa/) you can add a meta-widget, that will display the output of any CLI program. This means, of course, that you have all the power of the console to use in your custom made widgets. Need to check your laptop's battery? No need to search for a widget anymore, just [cat /proc/acpi/battery/BAT0/state](blog_md/2009/0514_EverythingisafileA.K.A.BatterystateonLinux.md). Need to check the weather? Just wget your favorite forecast page and parse it with grep, sed an awk. OK, maybe that's a little bit too much.

Once more this proves that anything can be done in console mode - and whatever you can't isn't worth doing anyway.

(\*) Wow, this article has been written a LONG time ago!


---
## In reply to [this post](), [Gnome 3.2 Released - Features and Updates : Ranjith Siji – Programming the Web](/blog_md/youfoundadeadlink.md) commented @ 2011-09-30T09:01:57.000+02:00:

[...] [...]

Original [published here](/blog_md/2011/0929_DIYgnomeapplets.md).
