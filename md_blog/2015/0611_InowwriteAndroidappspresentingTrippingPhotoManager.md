# I now write Android apps: presenting Tripping Photo Manager

@meta publishDatetime 2015-06-11T09:00:00.000+02:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2015/06/i-now-write-android-apps-presenting.html

I have been working in an awesome Android app recently, so I'd like to throw in a shameless self-plug here. Oh, wait, it's my blog. It's all basically a big shameless self-plug, isn't it? Anyway, I've been working on <https://github.com/nicolasbrailo/TrippingSdCardPhotoManager> , an open source SD card photo manager for Android.

Why an SD card photo manager? Whenever I go on holidays I never have enough SD cards to store all the snaps I take. Luckily I'm a crappy photographer, so I end up deleting half of the pictures I took during a day. This makes it easy to somewhat re-use the same SD card. In my experience, Android is not always great when it comes to managing files from an external SD card mounted through an USB adapter, hence this little app was born: it'll let you select the directory you want to use to manage pictures, from anywhere in the filesystem. It's also somewhat faster than the native gallery app, which is a plus when working with a slow-ish SD card.

This app also supports some stuff I find useful in my workflow, like renaming the current directory to something more meaningful than "YourCamera4242", backing stuff up in the device and batch deleting files. It also packs a version of [ImageMagick](http://www.imagemagick.org/script/index.php) I ported for Android, so in theory you can use your Android device to do anything you can do with a regular "mogrify" command in Linux.

The app is not available in Playstore, mostly because I'm a cheap bastard and don't want to pay the 10 bucks Google charges you to create an account, only to publish an open source application.

You can still install the APK from this link: <https://github.com/nicolasbrailo/TrippingSdCardPhotoManager/releases> - or you can contribute to the open source world (?) and buy me a Play Store account.

