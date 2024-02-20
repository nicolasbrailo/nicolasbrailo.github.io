# sed magic: a simple guide

@meta publishDatetime 2009-09-24T09:00:00.000+02:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2009/09/sed-magic-simple-guide.html

The other day I had to create one of those "enum to string" functions. They really suck, always getting out of sync, so I made a script to auto-update the header file containing this function... just add a target to the makefile and you're done!

Anyway, this is the part of the script I came up with to get the enum elements:

```bash

cat enum_definition.h | sed -n '/enum OID/,/};/ s/(.*)/1/p'

```

Nice voodoo, isn't it? How the hell are you supposed to understand that? Well, you're not, sed is write-only-code, but you can try reading <http://www.grymoire.com/Unix/Sed.html#toc-uh-25>, a great sed introduction.

Have fun!

