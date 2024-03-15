# Spotiweb

@meta publishDate 2024-03-14
@meta author Nico Brailovsky
@meta tags Projects, open source

If you find the native client for Spotify is too cluttered, [Spotiweb](https://github.com/nicolasbrailo/Spotiweb) can provide a simpler experience. [Spotiweb](https://github.com/nicolasbrailo/Spotiweb) automatically goes through the list of your followed artists to create an index groupped by category. The categories will be automatically determined based on the artists you follow. The result will be a simple web page with an index of all the artists you followed, groupped by somewhat logical categories (when categories exist).

![SpotiWeb running looks like this](https://raw.githubusercontent.com/nicolasbrailo/SpotiWeb/master/screenshot.png)

You can use this service from [nicolasbrailo.github.io/SpotiWeb](https://nicolasbrailo.github.io/SpotiWeb/) - you will need a developer API key+secret. All the storage is local to your browser (there is no key, user data or anything at all being sent to any external host, everything is done in your browser) and you can even use this client offline (Spotify won't work offline, though). You can also self-host this service, either by forking the project or by running it via a local webserver.

This is a utility that grew somewhat organically from a simple index of artists; as more and more features of the native client got broken in my different setups, the web app "grew" to replace it. Today it's pretty much a full-fledged web-app capable of replacing the native client entirely, able to play music using Spotify's web sdk, integrate with the native client (if one is available) and with local speakers in your network.

 * [Project repo: Spotiweb](https://github.com/nicolasbrailo/Spotiweb)
 * [Run in your browser](https://nicolasbrailo.github.io/SpotiWeb/)

