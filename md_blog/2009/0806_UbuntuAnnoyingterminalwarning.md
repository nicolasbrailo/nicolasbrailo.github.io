# Ubuntu: Annoying terminal warning

@meta publishDatetime 2009-08-06T11:00:00.000+02:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2009/08/ubuntu-annoying-terminal-warning.html

Although I'm quite happy with Ubuntu 9.04, I find a couple of new features quite annoying. The warning message it pops up whenever you try to close a console with a running program in it falls in this category. Fortunately it's not difficult to disable:

1. Open up gconf-editor
 - goto /apps/gnome-terminal/global/
 - Untick confirm\_window\_close

All set. As a bonus side effect now closing a terminal with multiple tabs won't pop up a message either.

