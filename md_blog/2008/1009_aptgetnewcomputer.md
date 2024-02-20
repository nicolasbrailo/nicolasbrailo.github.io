# apt-get new computer

@meta publishDatetime 2008-10-09T02:28:00.000+02:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2008/10/apt-get-new-computer.html

Siempre me olvido cuales son los paquetes copados para instalar en un nuevo sistema así que voy a copiarlo acá. Después pongo links a cada aplicación.


```bash
# APPS
apt-get install mozilla-thunderbird lyx

# DPOTD cool apps
apt-get install tilda mmv unclutter katapult moc

# DPOTD SA tools
sudo apt-get install knetworkmanager xdiskusage iptraf sshfs apt-listbugs

# Media stuff: flv player, shnsplit/cuebreakpoints (flac), winrar
apt-get install ffmpeg shntool cuetools flac wavpack unrar vlc

# Reading APE files (not recommended, though)
# cuebreakpoints \*.cue|shnsplit -o flac \*.ape
# http://aidanjm.wordpress.com/2007/02/15/split-lossless-audio-ape-flac-wv-wav-by-cue-file/
# http://aidanjm.wordpress.com/2007/01/26/using-monkeys-audio-ape-files-in-ubuntu/
wget http://members.iinet.net.au/~aidanjm/mac-3.99-u4\_b3-1\_i386.deb &&
sudo dpkg -i mac-3.99-u4\_b3-1\_i386.deb &&
rm -f mac-3.99-u4\_b3-1\_i386.deb

# Conky, sensores y plugins
apt-get install conky libxext-dev lm-sensors build-essential checkinstall wmctrl

# Servers y script dev
apt-get install apache2 php5 mysql5-server rails ruby

# Headers y demas (incluye X11)
apt-get install libc6-dev libstdc++6-4.1-dev g++-4.1 g++ dpkg-dev build-essential x11proto-core-dev linux-libc-dev libxau-dev libxdmcp-dev x11proto-input-dev x11proto-xext-dev x11proto-kb-dev xtrans-dev libx11-dev libxext-dev glibc-doc libgtk2.0-doc manpages-dev

# Headers para php
ant php5-dev ant-optional m4 autoconf autotools-dev automake1.4

# Ecplise con CDT
apt-get install java-common libswt3.2-gtk-jni libswt3.2-gtk-java eclipse-rcp liblucene-java liblucene-java-doc libjsch-java libservlet2.4-java libcommons-el-java java libcommons-collections-java java libcommons-logging-java java libcommons-launcher-java liblog4j1.2-java libregexp-java libbcel-java libmx4j-java libcommons-collections3-java libcommons-beanutils-java libcommons-digester-java libcommons-modeler-java libcommons-pool-java libcommons-dbcp-java libtomcat5.5-java eclipse-platform junit eclipse-jdt eclipse-pde exuberant-ctags eclipse-cdt mlock libc-client2002edebian zlib1g-dev libssl-dev eclipse libtld3 odbcinst1debian1 unixodbc sun-java5-bin
```

