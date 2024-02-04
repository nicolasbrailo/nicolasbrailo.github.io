# Pictag: finally a simple geotagging tool for Linux

@meta publishDatetime 2013-08-01T09:00:00.000+02:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2013/08/pictag-finally-simple-geotagging-tool.html

TL;DR: Link to a mostly working [hacked version of Pictag, on my Github repo](https://github.com/nicolasbrailo/pictag).

Since Google decided not to support Picasa for Linux anymore (yes, a long time ago) I've been looking for a decent photo management alternative. Lately I've settled with Digikam, it does everything Picasa used to do (and much better, I may add) except for providing a way to geotag your pictures on a map.

Most geotagging solutions involve having an already created waypoints map from a GPS device, which then gets processed and magically added to the images' exif data. That didn't cut it for me, I don't have, nor want, a GPS I can take on holidays, plus I really only want to drag and drop pictures on a map. That's where [pictag](https://launchpad.net/pictag) comes in.

At the moment [pictag](https://launchpad.net/pictag) seems to be a bit abandoned, as there are no more packages for Ubuntu 13.04. Luckily with some hacking it's possible to get it running.

First, since there's no package for Pictag you'll need to take care of the dependencies yourself. On a more or less vanilla 13.04 install, this should do the trick:

```c++
sudo apt-get install python-setuptools \
                     python-distutils-extra \
                     geoclue-ubuntu-geoip \
                     liblaunchpad-integration-common \
                     libchamplain-0.12-0 \
                     libchamplain-0.12-dev \
                     libchamplain-gtk-0.12-0 \
                     libchamplain-gtk-0.12-dev \
                     python-pyexiv2 \
                     libclutter-gtk-1.0-0 \
                     libclutter-gtk-1.0-dev
```

After you've taken care of that you can download the latest version from [Launchpad](https://launchpad.net/pictag) (while writing this article that should be 12.07.17) and run ./bin/pictag, only to watch it fail miserably.

Pictag seems to be using GSettings, a very annoying Gnome settings manager which won't work unless you actually install whatever program you're trying to run. Luckily we can just hack it out of Pictag simply by commenting out all references to self.settings in PictagWindow.py and Window.py. Either that or get my [hacked version of Pictag, on my Github repo](https://github.com/nicolasbrailo/pictag).

With some luck, my hacked version of Pictag should run pretty much OK on Ubuntu 13.04 or newer. There seems to be a few issues with libchamplain (the mapping library) on earlier versions of Ubuntu that may cause the map to display only broken images. If you can't load any maps you'll have to get a newer Ubuntu. Or fork my repo and get hacking :)

