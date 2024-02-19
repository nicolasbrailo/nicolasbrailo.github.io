# apt-get install new computer III

@meta publishDatetime 2009-05-19T10:00:00.000+02:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2009/05/apt-get-install-new-computer-iii.html

Check the other two parts of this series:

* [apt-get install new-computer II](/blog_md/2008/1228_aptgetinstallnewcomputerII.md)
* [apt-get new system](/blog_md/2008/1009_aptgetnewcomputer.md)

I recently [updated to Ubuntu 9.04](/blog_md/2009/0427_UbuntuJ.J..md) and had to reinstall my work computer. Since the stuff I use for work (mostly c++ programming) was left out in the previous two posts I'll post it here:

* Install build tools:

```c++
sudo apt-get install g++ gdb build-essential g++-4.2 omniorb4 omniidl4-python omniidl4 libxerces-c2-dev
```

* Can't live without VIM:

```c++
sudo apt-get install vim gvim vim-common vim-doc vim-full vim-gnome vim-gtk
```

* Some additional tools:

```c++
sudo apt-get install ddd devhelp doxygen doxygen-gui exuberant-ctags ctags  subversion
```

* Install bandwith monitor:

```c++
sudo apt-get install ifstat
```

* Don't you hate when you need to read an Office document while working on the console? Me too, try antiword:

```c++
sudo apt-get install antiword
```

Done, a couple of apt-get's and you are ready to build your c++ projects! (Ok, actually only the first one is needed, the others are nice-to-have programs).

