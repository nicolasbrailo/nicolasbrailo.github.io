# Fixing some annoying GTK Warnings

@meta publishDatetime 2011-11-22T05:00:00.000+01:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2011/11/fixing-some-annoying-gtk-warnings.html

So, new Buguntu upgrade, new problems. The usual deal. I don't like Unity so I installed the usual gnome desktop. Now when I start gVim I get a bunch of errors like this:

```c++
(gvim:7189): Gtk-WARNING **: Unable to locate theme engine in module_path: "pixmap"
```

OK, not errors, just warnings. I don't like them anyway, so I did this to fix it:

```c++
sudo apt-get install gtk2-engines-pixbuf
```

Now it works. One problem less, NaN to go... time to move back to Debian?

