# Bash ',' is a legal function name, and a perfect prefix

@meta publishDate 2024-03-15
@meta author Nico Brailovsky
@meta tags Bash

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

