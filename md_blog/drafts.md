# Drafts

@meta docType skipHtmlGen

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



