# ndk-gdb life tip: use --verbose

@meta publishDatetime 2015-06-16T09:00:00.000+02:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2015/06/ndk-gdb-life-tip-use-verbose.html

Crosscompiling is always fun. No matter how ready-to-use it's packaged, and Android does a pretty decent job at that, you're still bound to find problems that leak through the abstraction layers. If something says it's dummy-proof, I always find the way to perfect myself and be even dumber. For people like me; do yourselves a favour and start launching ndk-gdb this way:

```
ndk-gdb --start --verbose
```

Using the --verbose parameter will probably reveal some hidden errors. For example, when I forgot to chmod 777 my gdbserver binary:

```
## COMMAND: adb_cmd pull /system/bin/app_process ./obj/local/armeabi-v7a/app_process
run-as: exec failed for /data/data/com.nico.trippingsdcardphotomanager/lib/gdbserver Error:Permission denied
117 KB/s (9560 bytes in 0.079s)
Pulled app_process from device/emulator.
```

