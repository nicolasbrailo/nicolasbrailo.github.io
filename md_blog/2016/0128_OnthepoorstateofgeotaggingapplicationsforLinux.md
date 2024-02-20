# On the poor state of geotagging applications for Linux

@meta publishDatetime 2016-01-28T08:00:00.000+01:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2016/01/on-poor-state-of-geotagging.html

#### tl;dr

I hacked together [IMGeotagger](https://github.com/nicolasbrailo/IMGeotagger), a Geotagger for Linux (though it should work in Windows too) that uses Google maps.

#### Not-so-tl;dr-version

Recently, after coming back from a trip, I tried to geotag (\*) my pictures. I don't have a fancy GPS device for my camera but I do have a fairly good memory. There are applications that will let you drop your pics to a map, then get the GPS coordinates out of that. Unfortunately, the current state of geotagging applications in Linux is just sad.

[Gotten Geography](https://launchpad.net/~gottengeography/+archive/ubuntu/ppa) mostly works. I don't find it very nice to use, though. [Pictag](https://github.com/nicolasbrailo/pictag) doesn't even work anymore, although I have [hacked a version](https://github.com/nicolasbrailo/pictag) which at least manages to start in modern Ubuntu setups. That puts it more or less at the same level as Gotten Geography. Both suffer from a fatal problem: there is no latin charset maps for places that don't use a latin alfabet. Now, this is clearly not a fault in either program.

Both Gotten and Pictag use the (incredibly awesome) [Open Street Map](https://www.openstreetmap.org) project. OSM provides some default map rendered tiles, and those are in the "local" language. Transliterating the local written name of a street is not an easy task. The rules in each place are completely different, some places have a completely different name in latin chars than they do in the local alphabet and a million other problems that can't be solved as a general case.

What to do when there are no readily available OSM tiles with latin chars? There is a fairly good product that does provide latin names for most (all?) places in the world: Google maps. Now, there is a reason neither Gotten nor Pictag use Google maps for geotagging: Google maps has no (free?) API to get tiles which you can embed in an application. It does let users view their maps in a browser, though. And the map URI is a nice and easy way to translate from map-tiles to map-coordinates.

I'm not 100% sure if [IMGeotagger](https://github.com/nicolasbrailo/IMGeotagger) falls under Google maps terms of use, so I may have to take it down in the future. What it does is pretty simple: you use a browser to select a place, then IMGeotagger retrieves the location from the URI of the browser. This will break when Google maps changes their URI structure; until then, IMGeotagger works pretty well and it uses a really nice map (sorry OSM, G. Maps are pretty good).

You can grab the IMGeotagger (and its source code, as it's open source) from <https://github.com/nicolasbrailo/IMGeotagger>.

(\*) What's geotagging? That's adding GPS coordinates on the exif metadata of your pictures. This is only useful to nerds and very pedantic people who enjoy analyzing photo albums to get GPS plots and other nerdy things like that.

