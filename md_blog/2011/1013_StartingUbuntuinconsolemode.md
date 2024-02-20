# Starting Ubuntu in console mode

@meta publishDatetime 2011-10-13T09:00:00.000+02:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2011/10/starting-ubuntu-in-console-mode.html

Like it or not, Ubuntu is so easy to install that even for servers is very comfortable to just mount the iso and create as many virtual machines as you may need. Sometimes you already have an iso for Ubuntu, but are too lazy to download the server version. For those occasions you can either decide to waste precious RAM running a GUI for a server that will never need it, or you can remove all traces of the graphical login. Like this:

```c++
sudo update-rc.d -f gdm remove
```

This will remove GDM from the startup scripts, meaning you can still fire up the graphical interface (\*) if you want, but it will start Ubuntu without loading any graphics stuff. This is very useful to save on RAM, startup time and processing power, which even if not that useful for a desktop machine is incredible beneficial when you have several virtual machines running in a single physical server.

(\*) More precisely, if you have users that need it. Remember though, if it can't be done in console mode, it ain't worth doing.

