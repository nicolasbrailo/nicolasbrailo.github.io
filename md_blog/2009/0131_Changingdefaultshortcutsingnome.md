# Changing default shortcuts in gnome

@meta publishDatetime 2009-01-31T16:48:00.000+01:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2009/01/changing-default-shortcuts-in-gnome.html

Another of those thing I usually forget: changing default shortcut actions in gnome. In this case, I'm using
[MOC](http://moc.daper.net/) as my music player (see
[apt-get install new computer II](/blog_md/2008/1228_aptgetinstallnewcomputerII.md) and while it's great it won't integrate nicely with gnome. Fortunately (as most GNU/Linux applications do) it can be commanded via CLI so it isn't hard to change this.

Now, gnome keyboard shortcuts already have defined actions, so how can we change them to invoke "a custom command? Easy enough:

1. Open gconf-editor
2. Go to apps > metacity > keybinding\_commands
3. Set a command from the list. In my case I'm going to set command\_1 to "mocp -S", command\_2 to "mocp -f" and command\_3 to "mocp -r"
4. Go to"apps > metacity > global\_keybinding
5. Set the corresponding run\_command\_\* to the keyboard shortcut. For me that's 0xA2 for run\_command\_1, 0xE9 for run\_command\_2 and 0xEA for run\_command\_3; beware it changes between keyboards.

**Troubleshooting tips:**
* If you use gconf-editor for a key binding don't use it again System > Preferences > Key bindings
* For hex value keybindings (like the ones I used on the example) use uppercase
* If it's not working and you can't figure out why try with an already working command and a simple keybinding (e.g. gnome-screenshot and ctrl-p) then change each one in turn, see where it breaks. Divide and conquer!!

