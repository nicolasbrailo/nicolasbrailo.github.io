# Drafts


@meta docType skipHtmlGen

## Wifi from CLI to work on main eth connection

Another one to file in the category of self reminders: whenever I need to work on the main eth connection of a server, instead of grabbing a keyboard and a monitor it's easier to connect to wifi. Being a server, this cheatsheet will be useful:

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
wpa_supplicant -B -i wlp3s -c < $( wpa_passphrase "<your ssid name>" "<password>" )
# Request IP
dhclient wlp3s0
# Confirm connection
ip addr show wlp3s0
```

Work on main interface (leave on a loop, in case wifi disconnects for whatever reason)

```bash
while true; do dhclient -r eno1 ; dhclient eno1 ; ip addr show eno1; sleep 1; echo "DONE"; done 
```

When done, showtdown wifi

```bash
ip link set wlp3s0 down
# Release addr locally
dhclient -r wlp3s0
# To be sure:
rfkill
```

# Vim can wget + c-w search 

I (re?)learned a thing today: Vim can wget a site!

Doing `c-w gf` tells Vim to open whatever path is under the cursor. This is usually something like "#include <foo/bar/baz.h>", which means it will ask Vim to open `foo/bar/baz.h`. If you happen to have `http://nicolasbrailo.github.io` under your cursor, you'll be fetching this site into a temp buffer, in Vim.

## Bonus tip:

If `c-w gf` isn't finding the files you want it to, you may need to set your search path:

```vim
set path+=/home/user/path/to/foo,/home/user/src/bar
```


# Bash: list ALSA PCMs

If you can't figure out which of your ALSA cards you should be using, just try them all:


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

# Bash: goto

I rediscovered a nifty little utility I added to my [bashrc](https://github.com/nicolasbrailo/Nico.rc) a while back: [goto](https://github.com/nicolasbrailo/Nico.rc/blob/master/bash/goto.sh). Goto is a short script that works as a bookmark mechanism for Bash. With you, you can set a bookmark directory, and then jump to that directory from anywhere else (with autocomplete). For example:

```bash
$ cd foo/bar/baz
foo/bar/baz$ goto . bookmark
foo/bar/baz$ cd /
/$ goto boo<tab>
foo/bar/baz$
```

It works by setting itself as a Bash autocomplete, so that bookmarks are autocompletable and available anywhere in Bash. A bookmark is itself nothing more than a symlink saved to `~/goto`.

To install, you can `wget -O - https://github.com/nicolasbrailo/Nico.rc/blob/master/bash/goto.sh > ~/.goto.sh` and add it to your bashrc.


# Bash ',' is a legal function name, and a perfect prefix

If you have a set of [miscellaneous Bash-helpers](https://github.com/nicolasbrailo/Nico.rc) that you frequently use, you probably want some sort of namespace for easy access. For example, prepending the name of all your helpers with "myHelper-" is a good way of getting autocomplete to show only the relevant helpers you need. "myHelper-" is too much typining, though.

Unless your distro is extremely minimnal, all the letters in Bash are taken and you can't have an unambiguous single-letter "namespace". You need to look beyond letters: ',' is a ferpectly legal Bash name. You can prefix all your helpers with ',' for easy and quick autocomplete. An example [from my bashrc](https://github.com/nicolasbrailo/Nico.rc/blob/master/bash/android.sh):

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


# Bash: dynamic PS1 based on terminal size

Another utility I recently rediscovered in my [bashrc](https://github.com/nicolasbrailo/Nico.rc): [dynamic PS1 based on terminal size](https://github.com/nicolasbrailo/Nico.rc/blob/master/bash/ps1.sh). Of course, I've had this enabled for years, but I never really "noticed" it: it's just how Bash works, right?

[ps1.sh](https://github.com/nicolasbrailo/Nico.rc/blob/master/bash/ps1.sh) will do a few things:

* Assign a host number to your computer, so that it has a unique(ish) color. This lets you ssh all around, and you can immediatly know in which host your are even if you don't remember the hostname.
* Set a SHORT_PS1, with nothing bug a time and a prompt
* Set LONG_PS1, which by default has time, host and path

Using [Bash traps](md_blog/2015/0416_BashtrapsalmostlikeRAIIforbash.md), it's possible to detect when the terminal changes size: you need to `trap $YOUR_FUNC SIGWINCH`. You can [download this script](https://github.com/nicolasbrailo/Nico.rc/blob/master/bash/ps1.sh), add it to your bashrc in a trap, and get dynamic prompts depending on your terminal width.


https://github.com/nicolasbrailo/SpotiWeb
https://github.com/nicolasbrailo/GitToDo
https://github.com/nicolasbrailo/PyTelegramBot
https://github.com/nicolasbrailo/PianOli
https://github.com/nicolasbrailo/wta
https://github.com/nicolasbrailo/zigbee2mqtt2web



