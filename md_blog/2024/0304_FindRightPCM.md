# Bash: list ALSA PCMs

@meta publishDate 2024-03-04
@meta author Nico Brailovsky
@meta tags Bash, Fixing things, Linux, Audio


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

