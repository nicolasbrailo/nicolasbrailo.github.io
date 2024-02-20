# Android studio and ndk-gdb to debug a native app

@meta publishDatetime 2015-06-25T09:00:00.000+02:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2015/06/android-studio-and-ndk-gdb-to-debug.html

I don't know how good Android Studio support for native apps is nowadays (it changes from week to week!). Up to a few months ago, Gradle, the build system used by AS, had poor support for native development. If you're having problems, you may find it easier to workaround it completely when it comes to build and debug C/C++ applications.

To debug a native Android application, a binary called gdbserver and its associated gdb.setup must be included in the generated APK file. Including this into the APK can be very painful in Gradle, so here's a workaround I found:

1. Build your stuff the way you normally would (I'm assuming you know already how to build a native app, and if you don't there are guides online that explain it much better than I could).
2. Deploy your application the way you normally would.
3. Discover ndk-gdb won't run. Bang forehead against keyboard a few times.
4. After losing some hours looking at logs, figure out there's no gdbserver included in your apk.
5. Lose some more hours trying to figure out how to include it in your apk using Gradle.
6. Give up. Bang forehead against keyboard some more.
7. find the gdbserver and gdb.setup in your build directory.
8. adb push each of these files to the device.
9. Using adb shell, move the files you copied to /data/app-lib/com.yourapp/ - you may need to root your device for this.
10. Profit! ndk-gdb now works.

Edit: remember you may need to [chmod +777 your gdbserver](/md_blog/2015/0616_ndkgdblifetipuseverbose.md).


# Comments

---
## In reply to [this post](), [gaps]() commented @ 2015-10-09T12:15:01.000+02:00:

you just need to add "jniDebuggable true" to your debug buildType.
This option is there for quite a long time.

Original [published here](/md_blog/2015/0625_Androidstudioandndkgdbtodebuganativeapp.md).

---
## In reply to [this post](), [nicolasbrailo](/md_blog) commented @ 2015-10-09T12:33:09.000+02:00:

Thanks for the info! I recall trying that option and it still didn't manage to include the gdbserver binary. Hopefully it does now.

Original [published here](/md_blog/2015/0625_Androidstudioandndkgdbtodebuganativeapp.md).
