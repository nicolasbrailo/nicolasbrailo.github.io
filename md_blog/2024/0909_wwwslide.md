# Homeboard: wwwslide

@meta publishDate 2024-09-10
@meta author Nico Brailovsky
@meta tags IoT, RaspberryPi, Homeboard

Homeboard hasn't seen much progress during the holidays, except for a small but useful piece of software: I created [a hacky way to serve pictures over a web interface](https://github.com/nicolasbrailo/wwwslide). This is a fairly fundamental piece of infrastructure for my homeboard project; most of the time these will be displaying some ambient information, but most of the screen's real estate will be used to show my (reasonably large and decades spanning) personal picture collection.

[wwwslide](https://github.com/nicolasbrailo/wwwslide) looks like this:

[![](/blog_img/1009_wwwslide.jpg)](/blog_img/1009_wwwslide.jpg)

From the readme:

> wwwslide is a client/server for LAN slideshows. If you have a large picture collection and want a way to display them in multiple places, wwwslide server will create a web interface to retrieve random pictures from a single url. The web client can display these pictures, but there is no reason to use the included client: you could curl wwwslide and pipe it to an image viewer.

> wwwslide has a server that can be pointed to a local pictures directory. It expects that pictures will be grouped in albums, sorted by /$year/$arbitrary_name/*.jpg (eg 2019/foo/bar/album/*.jpg). On startup, it will pick up one album, randomly, and serve a few pictures from this album to anyone calling its /get_image web endpoint. Once it runs out of pictures for this album, it will select a new random album (with a new random subset of pictures).

> The included client (which can be accessed on the root of the server) can be used to browser this picture (just point your browser to your wwwslide LAN address). It's not very smart, but it should work!

> Remote control: each picture includes a QR code. Scanning the QR will take you to a local page with metadata of the shown image. This page can also be used to control wwwslide (eg to request that this album is displayed from the start, or to select a new album)

> Reverse geolocation: the metadata of each picture includes a reverse-geolocation. No need to guess where you took a picture, wwwslide will guess for you (as long as your pictures have geotags in their exif data)


wwwslide v0 was just a Flask service sending local-disk jpg's, and I found I frequently wondered where a particular picture was taken, or wish I had a way to see more pictures from a specific location. I'm quite proud of the idea to implement this: wwwslide will watermark pictures with a qr-code that can be used to get more info on the shown picture, and to display more picture of a specific album.

