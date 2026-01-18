#
@meta docType index
## Raspberry Pi UART debug notes

Post by Nico Brailovsky @ 2024-05-19 | [Permalink](md_blog/2024/0519_RaspberryPiUARTNotes.md)  | [Leave a comment](https://github.com/nicolasbrailo/nicolasbrailo.github.io/issues/new?title=Comment@md_blog/2024/0519_RaspberryPiUARTNotes.md&body=I%20have%20a%20comment!)

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





---

## Raspberry Pi: HDMI debugging

Post by Nico Brailovsky @ 2024-05-18 | [Permalink](md_blog/2024/0518_RaspberryPiHDMI.md)  | [Leave a comment](https://github.com/nicolasbrailo/nicolasbrailo.github.io/issues/new?title=Comment@md_blog/2024/0518_RaspberryPiHDMI.md&body=I%20have%20a%20comment!)

If a Raspberry Pi boots but has no HDMI signal:

* Add `hdmi_force_hotplug=1` to /boot/firmware/config.txt - this forces the Pi to send HDMI video even if it thinks there's no monitor connected.
* Add `config_hdmi_boost=4` to /boot/firmware/config.txt - this tweaks the HDMI signal strength.

Also, remove all possible adapters (each will add a bit of noise and attenuation) and get a cable with good shielding.

Source <https://elinux.org/R-Pi_Troubleshooting#No_HDMI_output_at_all>

Extra tip: Unlike their bigger brothers, Raspberry Pi Zeros don't seem to want to boot up with no SD card in, not even to show a bootloader error.





---

## Zigbee Boiler

Post by Nico Brailovsky @ 2024-05-06 | [Permalink](md_blog/2024/0506_ZigbeeBoiler.md)  | [Leave a comment](https://github.com/nicolasbrailo/nicolasbrailo.github.io/issues/new?title=Comment@md_blog/2024/0506_ZigbeeBoiler.md&body=I%20have%20a%20comment!)

Weekend project: made my boiler Zigbee compatible, bypassing a Drayton heating thermostat. I'm quite proud of the final results:

[![](/blog_img/zigbeeboiler01.jpg)](/blog_img/zigbeeboiler01.jpg)

On the left, the wiring; on the right, the control panel. **Disclaimer: this note shows an experiment. Don't take any electrical advise from this text.**

For a few years, I've been using <a href="https://github.com/nicolasbrailo/zigbee2mqtt2web">my own home automation system</a>, developed almost from scratch. I should write about it some day (tl;dr, it was a fun weekend project that turned into multiple, mostly fun, weekend projects). Something missing from my home automation was heating integration, which is especially sad given I have Zigbee temperature sensors everywhere. With the winter over I spent a weekend working on making my boiler Zigbee compatible (wouldn't want an expensive emergency visit in the middle of winter to repair my boiler).

My boiler uses a Drayton thermostat as a control, which seems very common in the UK (n=3). They seem mostly used as an on/off switch (OpenTherm isn't very common here), so there's no reason I couldn't bypass it with a relay while keeping the normal thermostat as a backup. Both the installation manual and the back of my control unit confirm this:

[![](/blog_img/zigbeeboiler02.jpg)](/blog_img/zigbeeboiler02.jpg)

The heating-on signal is just closing the circuit between two terminals. For good measure, I decided to check this with a volt-meter (which, by the way, I strongly recommend against; unlike attaching a probe to a running program with gdb, probing a live circuit can be a shocking experience).

Once I was triple sure the chances of sparks and magic smoke where low, I got a 1 channel Zigbee relay module (220v, dry, 5 amps); if you are reading this guide for inspiration, make sure your switch can handle more power than your fuse. You don't want random electrical equipment acting as a fuse for your fuse. Also look for a "dry" relay, to keep power supply and control circuits separate, and needless to say it should handle 220V. I went for a "MHCOZY Tuya Dry Contact Zigbee Relay Switch Module,1 Channel AC 100-240V" - there are a few like these and they all seem to be the same whitelabel Zigbee element.

[![](/blog_img/zigbeeboiler03.jpg)](/blog_img/zigbeeboiler03.jpg)

A picture of the wiring; the connection needs to be parallel to the existing controller, to keep both working.

The control logic lives in my [monolithic home automation repo](https://github.com/nicolasbrailo/zigbee2mqtt2web/blob/master/zigbee2mqtt2web_extras/heating/rules.py), as a set of configurable Python rules, and while I've only had a few cold days to try them out, they seem to work. Next winter I'll be able to control my thermostat remotely from my [Telegram bot](https://github.com/nicolasbrailo/PyTelegramBot), while I take a holiday to the beach.





---

## Backup your Github repos

Post by Nico Brailovsky @ 2024-03-17 | [Permalink](md_blog/2024/0317_GithubBackups.md)  | [Leave a comment](https://github.com/nicolasbrailo/nicolasbrailo.github.io/issues/new?title=Comment@md_blog/2024/0317_GithubBackups.md&body=I%20have%20a%20comment!)

I try to back up all my online accounts, in case a provider ceases to exist, or one of my accounts is banned for (unknowingly) breaking terms-of-service. The other day I figured I wasn't doing that with Github, so I wrote [a script to back up all my (or any user's) repos automatically](https://github.com/nicolasbrailo/Nico.rc/blob/master/github.backup.sh). The gist is:

```bash
wget -q "https://api.github.com/users/$USER/repos" -O- > idx.json
for repo in $( cat idx.json | jq '.[].ssh_url' ); do
  git clone --recurse-submodules "$repo"
done
```

This will clone all *PUBLIC* repos to a local computer, from which you can tar.gz and upload to your preferred archive medium.





---

## Bash ',' is a legal function name, and a perfect prefix

Post by Nico Brailovsky @ 2024-03-15 | [Permalink](md_blog/2024/0315_BashCommaIsAValidFunctionName.md)  | [Leave a comment](https://github.com/nicolasbrailo/nicolasbrailo.github.io/issues/new?title=Comment@md_blog/2024/0315_BashCommaIsAValidFunctionName.md&body=I%20have%20a%20comment!)

If you have a set of [miscellaneous Bash-helpers](https://github.com/nicolasbrailo/Nico.rc) that you frequently use, you probably want some sort of namespace for easy access. For example, prepending the name of all your helpers with "myHelper-" is a good way of getting autocomplete to show only the relevant helpers you need. "myHelper-" is too much typing, though.

Unless your distro is extremely minimal, all the letters in Bash are taken and you can't have an unambiguous single-letter "namespace". You need to look beyond letters: ',' is a ferpectly legal Bash name. You can prefix all your helpers with ',' for easy and quick autocomplete. An example [from my bashrc](https://github.com/nicolasbrailo/Nico.rc/blob/master/bash/android.sh):

```bash
function ,alogcat() {
  local MAYBE_TEE
  MAYBE_TEE="$1"
  adb logcat -c
  if [ -z "${MAYBE_TEE}" ]; then
    adb logcat
  else
    adb logcat | tee "$MAYBE_TEE"
  fi
}

function ,a-screen-off() {
  adb shell input keyevent 26
}
```

With this, I can type `,a` to get an autocomplete of just my Android helpers.





---

## Spotiweb

Post by Nico Brailovsky @ 2024-03-14 | [Permalink](md_blog/2024/0314_Spotiweb.md)  | [Leave a comment](https://github.com/nicolasbrailo/nicolasbrailo.github.io/issues/new?title=Comment@md_blog/2024/0314_Spotiweb.md&body=I%20have%20a%20comment!)

If you find the native client for Spotify is too cluttered, [Spotiweb](https://github.com/nicolasbrailo/Spotiweb) can provide a simpler experience. [Spotiweb](https://github.com/nicolasbrailo/Spotiweb) automatically goes through the list of your followed artists to create an index groupped by category. The categories will be automatically determined based on the artists you follow. The result will be a simple web page with an index of all the artists you followed, groupped by somewhat logical categories (when categories exist).

![SpotiWeb running looks like this](https://raw.githubusercontent.com/nicolasbrailo/SpotiWeb/master/screenshot.png)

You can use this service from [nicolasbrailo.github.io/SpotiWeb](https://nicolasbrailo.github.io/SpotiWeb/) - you will need a developer API key+secret. All the storage is local to your browser (there is no key, user data or anything at all being sent to any external host, everything is done in your browser) and you can even use this client offline (Spotify won't work offline, though). You can also self-host this service, either by forking the project or by running it via a local webserver.

This is a utility that grew somewhat organically from a simple index of artists; as more and more features of the native client got broken in my different setups, the web app "grew" to replace it. Today it's pretty much a full-fledged web-app capable of replacing the native client entirely, able to play music using Spotify's web sdk, integrate with the native client (if one is available) and with local speakers in your network.

 * [Project repo: Spotiweb](https://github.com/nicolasbrailo/Spotiweb)
 * [Run in your browser](https://nicolasbrailo.github.io/SpotiWeb/)





---

## Bash: list ALSA PCMs

Post by Nico Brailovsky @ 2024-03-04 | [Permalink](md_blog/2024/0304_FindRightPCM.md)  | [Leave a comment](https://github.com/nicolasbrailo/nicolasbrailo.github.io/issues/new?title=Comment@md_blog/2024/0304_FindRightPCM.md&body=I%20have%20a%20comment!)

Linux audio isn't friendly, even if pipewire is making huge strides in making it "just work". If you ever find you need to get down to the ALSA level, something is probably very broken. If (when) this happens, and you can't figure out which of your ALSA cards you should be using, just try them all:


```bash
set -euo pipefail

if [ -z "${1+x}" ] || [ ! -f "${1}" ]; then
  echo "Will iterate over all known PCMs to try to capture or play audio and report which work"
  echo "Usage: $0 PLAYABLE_FILE"
  exit 1
fi

sample=${1}
plays_pcms=$( aplay --list-pcms | grep ':CARD=' )
for dev in $plays_pcms; do
  aplay --duration=1 --device="$dev" "$sample" 1>/dev/null 2>/dev/null && \
    echo "Playback may work on interface '$dev'"
done

cap_pcms=$( arecord --list-pcms | grep ':CARD=' )
for dev in $cap_pcms; do
  arecord --rate 48000 -f S16_LE --disable-resample --duration=1 --device="$dev" \
      /dev/null 1>/dev/null 2>/dev/null && \
      echo "Capture may work on interface '$dev'"
done
```





---

## Vim can wget + c-w search

Post by Nico Brailovsky @ 2024-03-03 | [Permalink](md_blog/2024/0303_VimWgetSite.md)  | [Leave a comment](https://github.com/nicolasbrailo/nicolasbrailo.github.io/issues/new?title=Comment@md_blog/2024/0303_VimWgetSite.md&body=I%20have%20a%20comment!)

I (re?)learned a thing today: Vim can wget a site!

Doing `c-w gf` tells Vim to open whatever path is under the cursor. This is usually something like "#include <foo/bar/baz.h>", which means it will ask Vim to open `foo/bar/baz.h`. If you happen to have `http://nicolasbrailo.github.io` under your cursor, you'll be fetching this site into a temp buffer, in Vim.

## Bonus tip:

If `c-w gf` isn't finding the files you want it to, you may need to set your search path:

```vim
set path+=/home/user/path/to/foo,/home/user/src/bar
```





---

## Wifi from the CLI

Post by Nico Brailovsky @ 2024-03-01 | [Permalink](md_blog/2024/0302_CLIWifi.md)  | [Leave a comment](https://github.com/nicolasbrailo/nicolasbrailo.github.io/issues/new?title=Comment@md_blog/2024/0302_CLIWifi.md&body=I%20have%20a%20comment!)

Another one to file in the category of self reminders, and a cheatsheet I'll need this weekend: whenever I need to work on the main (eth!) connection of a server, instead of grabbing a keyboard and a monitor it's easier to connect to wifi. For example, when I need to change the IP of a Raspberry PI in my network. Note this guide assumes a Debian-like environment:

```bash
# Figure out which interfaces exist
ip a

# Figure out which interfaces are connected
ip link show
# For example:
ip link show wlp3s0
```

Restart the interface (which will do nothing, because it's probably not autoconfigurable)

```
ip link set wlp3s0 down
ip link set wlp3s0 up
```

Start `wpa_cli`. Creating a new network may be needed, but I don't have notes. Once a network is created, its config will be in `/etc/wpa_supplicant/wpa_supplicant.conf`. Then:

```bash
$ wpa_cli
> scan
[Wait a few seconds]
> scan_results
>
```

Connect:

```bash
# Connect
wpa_supplicant -B -i wlp3s -c < $( wpa_passphrase "your ssid name" "password" )
# Request IP
dhclient wlp3s0
# Confirm connection
ip addr show wlp3s0
```

Work on main interface (leave on a loop, in case wifi disconnects for whatever reason)

```bash
while true; do dhclient -r eno1 ; dhclient eno1 ; ip addr show eno1; sleep 1; echo "DONE"; done 
```

When done, kill wifi

```bash
ip link set wlp3s0 down
# Release addr locally
dhclient -r wlp3s0
# To be sure:
rfkill
```





---

## Bash: goto

Post by Nico Brailovsky @ 2024-03-01 | [Permalink](md_blog/2024/0301_BashGoto.md)  | [Leave a comment](https://github.com/nicolasbrailo/nicolasbrailo.github.io/issues/new?title=Comment@md_blog/2024/0301_BashGoto.md&body=I%20have%20a%20comment!)

I rediscovered a nifty little utility I added to my [bashrc](https://github.com/nicolasbrailo/Nico.rc) a while back: [goto](https://github.com/nicolasbrailo/Nico.rc/blob/master/bash/goto.sh). Goto is a short script that works as a bookmark mechanism for Bash. With it, you can set a bookmark directory, and then jump to that directory from anywhere else (with autocomplete). For example:

```bash
$ cd foo/bar/baz
foo/bar/baz$ goto . bookmark
foo/bar/baz$ cd /
/$ goto boo<tab>
foo/bar/baz$
```

It works by setting itself as a Bash autocomplete, so that bookmarks are autocompletable and available anywhere in Bash. A bookmark is itself nothing more than a symlink saved to `~/goto`.

To install, you can `wget -O - https://github.com/nicolasbrailo/Nico.rc/blob/master/bash/goto.sh > ~/.goto.sh` and add it to your bashrc.





---

@meta extraNav [Prev](md_gen/index1.md)