# Crazy git error

@meta publishDatetime 2013-08-22T09:00:00.000+02:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2013/08/crazy-git-error.html

Have you ever run into this error message on git before?

fatal: example.com/repo.git/info/refs not found: did you run git update-server-info on the server?

It can be very baffling, because it may happen even if you change absolutely nothing in your git's configuration. I've read most people attribute this to a typo, and that seems to be the most common case, but I found yet another thing that might trigger this error: if you have set a proxy server, for example for wget, using an environment variable like http\_proxy, https\_proxy or ftp\_proxy then git might be tripping up on your proxy and producing this error message.

