# Raspberry Pi UART debug notes

@meta publishDate 2024-05-19
@meta author Nico Brailovsky
@meta tags Raspberry Pi, Linux, Embedded, IoT

I spent a bit of time setting up UARTs to troubleshoot different Raspberry Pis. Here are my notes.

## Electrical config

* Get a UART to USB adapter. I got one called "UART-TTL USB Adapter with CH340G Converter for 3.3 V" for less than $5. This one comes with 5 pins: 3.3v, 5v, tx, rx, gnd. For Rpi's UART, we'll ignore the two Vcc pins, we just need tx, rx and gnd. The adapter needs to run at 3.3v for an Rpi.
* Connect GND=Rpi pin 6, RX adapter = Rpi pin 8 (GPIO14/TXD), TX adapter = Rpi pin 10 (GPIO15/RXD). Remember that tx and rx need to be inverted: tx in the adapter should be plugged to rx in the Rpi - See [here for a pinout map](https://www.raspberrypi.com/documentation/computers/raspberry-pi.html).
* UART is simple, but very sensitive to the quality of the electrical connection. Flaky connection leads to poor connectivity, and poor connectivity leads to lost bits. Really bad connections will come out garbled and impossible to read (probably not resembling text). Bad-but-not-terrible connections will appear broken, but legible (eg with missing characters). If the connection is flaky, try a different ground pin in the RPI (for example, you can switch GND to pin 39). You can also try a different USB hub.
* The adapter I got has an LED light for the TX path, and another for the RX path. This is very helpful to figure out if the connection is good (a bad connection results in a dim LED, or in both LEDs lighting up). It also helps detect when TX/RX are swapped.


## Raspberry Pi config

* echo "enable_uart=1" > /boot/firmware/config.txt (Or change in the sd card).
* In a (booted) Rpi: `rpi-eeprom-config`, then set `BOOT_UART=1` - this may not work in Raspberry Pis Zeros.
* Adding `uart_2ndstage=1` in config.txt should [help get bootloader logs](https://github.com/raspberrypi/firmware/issues/1301).
* Don't forget to configure the Kernel: `console=serial0,115200` should be in your cmdline.txt (it's set by default nowadays).
* If you are troubleshooting boot issues, `bootcode_delay=3` and `boot_delay=3` should add 3 seconds of [delay between bootloaders](https://www.raspberrypi.com/documentation/computers/legacy_config_txt.html).
* init_uart_baud can [tweak UART speed](https://www.raspberrypi.com/documentation/computers/configuration.html#part3.1), but shouldn't be needed unless your connection is very flaky and you can't fix it for some reason.


There are other things in config.txt that may or may not help. Here's mine:

```
enable_uart=1
dtparam=uart0=on
uart_2ndstage=1

hdmi_force_hotplug=1
config_hdmi_boost=4

bootcode_delay=3
boot_delay=3
```

## Test run

* Connect the adapter before power on the target, to get boot logs. The adapter should appear as /dev/ttyUSB0 or similar (tail dmesg to confirm)
* Monitor UART with `sudo screen /dev/ttyUSB0 115200` (115200 seems to be the default speed in Rpi, configured as a kernel param in cmdline.txt)
* Exit screen with `C-A \`
* If you don't like screen, minicom is nicer (scrollback works better with tmux, out of the box): `sudo minicom --device /dev/ttyUSB0`
* Exit minicom with `C-A x`

Extra tip: Unlike their bigger brothers, Raspberry Pi Zeros don't seem to want to boot up with no SD card in, not even to show a bootloader error.


## Example

If everything worked well, you should see either boot logs (if the UART was connected before power on) or a login screen. Here's an example of the first few seconds of my Rpi booting:


```
Raspberry Pi Bootcode
Read File: config.txt, 987
Read File: start.elf, 2980544 (bytes)
Read File: fixup.dat, 7303 (bytes)
MESS:00:00:04.185459:0: brfs: File read: /mfs/sd/config.txt
MESS:00:00:04.190074:0: brfs: File read: 987 bytes
MESS:00:00:04.226963:0: HDMI0:EDID error reading EDID block 0 attempt 0
MESS:00:00:04.233130:0: HDMI0:EDID error reading EDID block 0 attempt 1
MESS:00:00:04.239466:0: HDMI0:EDID error reading EDID block 0 attempt 2
MESS:00:00:04.245803:0: HDMI0:EDID error reading EDID block 0 attempt 3
MESS:00:00:04.252140:0: HDMI0:EDID error reading EDID block 0 attempt 4
MESS:00:00:04.258477:0: HDMI0:EDID error reading EDID block 0 attempt 5
MESS:00:00:04.264814:0: HDMI0:EDID error reading EDID block 0 attempt 6
MESS:00:00:04.271150:0: HDMI0:EDID error reading EDID block 0 attempt 7
MESS:00:00:04.277487:0: HDMI0:EDID error reading EDID block 0 attempt 8
MESS:00:00:04.283824:0: HDMI0:EDID error reading EDID block 0 attempt 9
MESS:00:00:04.289919:0: HDMI0:EDID giving up on reading EDID block 0
MESS:00:00:04.302298:0: brfs: File read: /mfs/sd/config.txt
MESS:00:00:07.306971:0: gpioman: gpioman_get_pin_num: pin LEDS_PWR_OK not defined
MESS:00:00:07.809022:0: gpioman: gpioman_get_pin_num: pin LEDS_PWR_OK not defined
MESS:00:00:07.814848:0: *** Restart logging
MESS:00:00:07.818724:0: brfs: File read: 987 bytes
MESS:00:00:07.826906:0: hdmi: HDMI0:EDID error reading EDID block 0 attempt 0
MESS:00:00:07.833596:0: hdmi: HDMI0:EDID error reading EDID block 0 attempt 1
MESS:00:00:07.840454:0: hdmi: HDMI0:EDID error reading EDID block 0 attempt 2
MESS:00:00:07.847313:0: hdmi: HDMI0:EDID error reading EDID block 0 attempt 3
MESS:00:00:07.854170:0: hdmi: HDMI0:EDID error reading EDID block 0 attempt 4
MESS:00:00:07.861028:0: hdmi: HDMI0:EDID error reading EDID block 0 attempt 5
MESS:00:00:07.867886:0: hdmi: HDMI0:EDID error reading EDID block 0 attempt 6
MESS:00:00:07.874743:0: hdmi: HDMI0:EDID error reading EDID block 0 attempt 7
MESS:00:00:07.881600:0: hdmi: HDMI0:EDID error reading EDID block 0 attempt 8
MESS:00:00:07.888459:0: hdmi: HDMI0:EDID error reading EDID block 0 attempt 9
MESS:00:00:07.895074:0: hdmi: HDMI0:EDID giving up on reading EDID block 0
MESS:00:00:07.900979:0: hdmi: HDMI0:EDID error reading EDID block 0 attempt 0
MESS:00:00:07.908770:0: hdmi: HDMI0:EDID error reading EDID block 0 attempt 1
MESS:00:00:07.915629:0: hdmi: HDMI0:EDID error reading EDID block 0 attempt 2
MESS:00:00:07.922486:0: hdmi: HDMI0:EDID error reading EDID block 0 attempt 3
MESS:00:00:07.929344:0: hdmi: HDMI0:EDID error reading EDID block 0 attempt 4
MESS:00:00:07.936201:0: hdmi: HDMI0:EDID error reading EDID block 0 attempt 5
MESS:00:00:07.943060:0: hdmi: HDMI0:EDID error reading EDID block 0 attempt 6
MESS:00:00:07.949917:0: hdmi: HDMI0:EDID error reading EDID block 0 attempt 7
MESS:00:00:07.956775:0: hdmi: HDMI0:EDID error reading EDID block 0 attempt 8
MESS:00:00:07.963633:0: hdmi: HDMI0:EDID error reading EDID block 0 attempt 9
MESS:00:00:07.970248:0: hdmi: HDMI0:EDID giving up on reading EDID block 0
MESS:00:00:07.976078:0: gpioman: gpioman_get_pin_num: pin EMMC_ENABLE not defined
MESS:00:00:07.991589:0: HDMI0: hdmi_pixel_encoding: 162000000
MESS:00:00:08.621290:0: brfs: File read: /mfs/sd/initramfs
MESS:00:00:08.625085:0: Loaded 'initramfs' to 0x0 size 0x9f66d9
MESS:00:00:08.642498:0: initramfs loaded to 0x1b5f9000 (size 0x9f66d9)
MESS:00:00:08.656992:0: dtb_file 'bcm2708-rpi-zero-w.dtb'
MESS:00:00:08.660702:0: brfs: File read: 10446553 bytes
MESS:00:00:08.671327:0: brfs: File read: /mfs/sd/bcm2708-rpi-zero-w.dtb
MESS:00:00:08.676246:0: Loaded 'bcm2708-rpi-zero-w.dtb' to 0x100 size 0x7823
MESS:00:00:08.696709:0: brfs: File read: 30755 bytes
MESS:00:00:08.713197:0: brfs: File read: /mfs/sd/overlays/overlay_map.dtb
MESS:00:00:08.749553:0: brfs: File read: 5195 bytes
MESS:00:00:08.757160:0: brfs: File read: /mfs/sd/config.txt
MESS:00:00:08.761107:0: dtparam: audio=on
MESS:00:00:08.771124:0: brfs: File read: 987 bytes
MESS:00:00:08.793681:0: brfs: File read: /mfs/sd/overlays/vc4-kms-v3d.dtbo
MESS:00:00:08.844556:0: Loaded overlay 'vc4-kms-v3d'
MESS:00:00:08.848045:0: dtparam: act_led_trigger=actpwr
MESS:00:00:08.865089:0: dtparam: uart0=on
MESS:00:00:08.974561:0: brfs: File read: 2760 bytes
MESS:00:00:08.981941:0: brfs: File read: /mfs/sd/cmdline.txt
MESS:00:00:08.985916:0: Read command line from file 'cmdline.txt':
MESS:00:00:08.991800:0: 'console=serial0,115200 console=tty1 root=PARTUUID=5c64668e-02 rootfstype=ext4 fsck.repair=yes rootwait'
MESS:00:00:09.100396:0: brfs: File read: 103 bytes
MESS:00:00:09.520104:0: brfs: File read: /mfs/sd/kernel.img
MESS:00:00:09.523957:0: Loaded 'kernel.img' to 0x8000 size 0x6c3648
MESS:00:00:09.529958:0: Device tree loaded to 0x1b5f1300 (size 0x7cde)
MESS:00:00:09.536944:0: uart: Set PL011 baud rate to 103448.300000 Hz
MESS:00:00:09.543886:0: uart: Baud rate change done...
MESS:00:00:09.547298:0: uart: Baud rate[    0.000000] Booting Linux on physical CPU 0x0
[    0.000000] Linux version 6.6.20+rpt-rpi-v6 (debian-kernel@lists.debian.org) (gcc-12 (Raspbian 12.2.0-14+rpi1) 12.2.0, GNU ld (GNU Binutils for Raspbian) 2.40) #1 Raspbian 1:6.6.20-1+rpt1 (2024-03-07)
[    0.000000] CPU: ARMv6-compatible processor [410fb767] revision 7 (ARMv7), cr=00c5387d
[    0.000000] CPU: PIPT / VIPT nonaliasing data cache, VIPT nonaliasing instruction cache
[    0.000000] OF: fdt: Machine model: Raspberry Pi Zero W Rev 1.1
[    0.000000] random: crng init done
[    0.000000] Memory policy: Data cache writeback
[    0.000000] Reserved memory: created CMA memory pool at 0x0b400000, size 256 MiB
[    0.000000] OF: reserved mem: initialized node linux,cma, compatible id shared-dma-pool
[    0.000000] OF: reserved mem: 0x0b400000..0x1b3fffff (262144 KiB) map reusable linux,cma
[    0.000000] Zone ranges:
[    0.000000]   Normal   [mem 0x0000000000000000-0x000000001bffffff]
[    0.000000] Movable zone start for each node
[    0.000000] Early memory node ranges
[    0.000000]   node   0: [mem 0x0000000000000000-0x000000001bffffff]
[    0.000000] Initmem setup node 0 [mem 0x0000000000000000-0x000000001bffffff]
[    0.000000] Kernel command line: coherent_pool=1M 8250.nr_uarts=1 snd_bcm2835.enable_headphones=0 snd_bcm2835.enable_hdmi=1 snd_bcm2835.enable_hdmi=0  smsc95xx.macaddr=B8:27:EB:E1:0B:27 vc_mem.mem_bast
[    0.000000] Dentry cache hash table entries: 65536 (order: 6, 262144 bytes, linear)
[    0.000000] Inode-cache hash table entries: 32768 (order: 5, 131072 bytes, linear)
[    0.000000] Built 1 zonelists, mobility grouping on.  Total pages: 113680
[    0.000000] mem auto-init: stack:all(zero), heap alloc:off, heap free:off
[    0.000000] Memory: 165396K/458752K available (10000K kernel code, 1478K rwdata, 3116K rodata, 452K init, 582K bss, 31212K reserved, 262144K cma-reserved)
[    0.000000] SLUB: HWalign=32, Order=0-3, MinObjects=0, CPUs=1, Nodes=1
[    0.000000] ftrace: allocating 34944 entries in 103 pages
[    0.000000] ftrace: allocated 103 pages with 5 groups
[    0.000000] trace event string verifier disabled
[    0.000000] NR_IRQS: 16, nr_irqs: 16, preallocated irqs: 16
[    0.000006] sched_clock: 32 bits at 1000kHz, resolution 1000ns, wraps every 2147483647500ns
[    0.000061] clocksource: timer: mask: 0xffffffff max_cycles: 0xffffffff, max_idle_ns: 1911260446275 ns
[    0.000146] bcm2835: system timer (irq = 27)
[    0.000913] Console: colour dummy device 80x30
[    0.000949] printk: console [tty1] enabled
[    0.001662] Calibrating delay loop... 697.95 BogoMIPS (lpj=3489792)
[    0.060283] CPU: Testing write buffer coherency: ok
[    0.060386] pid_max: default: 32768 minimum: 301
[    0.060548] LSM: initializing lsm=capability,integrity
[    0.060859] Mount-cache hash table entries: 1024 (order: 0, 4096 bytes, linear)
[    0.060931] Mountpoint-cache hash table entries: 1024 (order: 0, 4096 bytes, linear)
[    0.062179] cgroup: Disabling memory control group subsystem
[    0.064297] RCU Tasks Rude: Setting shift to 0 and lim to 1 rcu_task_cb_adjust=1.
[    0.064590] RCU Tasks Trace: Setting shift to 0 and lim to 1 rcu_task_cb_adjust=1.
[    0.064902] Setting up static identity map for 0x8220 - 0x8258
[    0.066193] devtmpfs: initialized
[    0.078200] VFP support v0.3: implementor 41 architecture 1 part 20 variant b rev 5
[    0.078605] clocksource: jiffies: mask: 0xffffffff max_cycles: 0xffffffff, max_idle_ns: 19112604462750000 ns
[    0.078696] futex hash table entries: 256 (order: -1, 3072 bytes, linear)
```

Won't win any ID prizes, but it got the job done:

[![](/blog_img/240519_UART.jpg)](/blog_img/240519_UART.jpg)

