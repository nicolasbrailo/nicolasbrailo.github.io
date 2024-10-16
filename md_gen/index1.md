#
@meta docType index
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

## MdLogGen

Post by Nico Brailovsky @ 2024-02-25 | [Permalink](md_blog/2024/0225_MdlogGen.md)  | [Leave a comment](https://github.com/nicolasbrailo/nicolasbrailo.github.io/issues/new?title=Comment@md_blog/2024/0225_MdlogGen.md&body=I%20have%20a%20comment!)

If you're reading this, you somehow found me at [nicolasbrailo.github.io](https://nicolasbrailo.github.io/blog). Maybe you came here from [one of my many previous blogs](md_blog/2024/0218_MovedAgain.md), and you're marveling at the beautiful new design (?). As I alluded to in the ["moved again"](md_blog/2024/0218_MovedAgain.md) note, this site is built from a source of md files, [using a custom md-to-html enginge](https://github.com/nicolasbrailo/MdlogGen). If you're sane, you're probably why I would create an md-to-html engine, instead of using one of the many available options.

## MdlogGen: yet another MD site generator

[MdlogGen](https://github.com/nicolasbrailo/MdlogGen) is a simple md-to-static-html, however it supports a few features I wasn't able to find elsewhere: comments, and site-search. MdlogGen depends on Github for these two features (or, rather, depends on the viewer to have a Github account to be able to use these two features).

MdlogGen also supports the exact feature set I need, no more and no less; while using an off-the-shelf generator may have been a better longer term investment, 90% for the raison d'etre of this site is "for fun", and spending a weekend writing hacky code is more fun than spending a weekend trying to figure out how to configure Github deploy rules, and learning to use a third party content generator. I get to write enough code for a living during the week - weekends are for fun code! An alternate reason is that I already had to spend a chunk of time cleaning XML exports from my previous sites to build this one - so MdlogGen is sort of a natural evolution of those scripts. Kind of.

Check out [MdlogGen](https://github.com/nicolasbrailo/MdlogGen)'s reamde: while many other md-to-html generators exist, I think this may be one of the simplest feature-complete generators out there.





---

@meta extraNav [Prev](md_gen/index.md) | [Next](md_gen/index2.md)