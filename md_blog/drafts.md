# Drafts


@meta docType skipHtmlGen

# Vim can wget
c-w gf on url creates tmp



## Wifi from CLI + Working on main eth connection

Work on the main eth connection while connected to Wireless

Find out the state of network

```bash
## Figure out which interfaces exist
ip a

## Figure out which interfaces are connected
ip link show
ip link show wlp3s0
```

Restart the interface, which will do nothing

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

Connect?

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


## TODO rfkill?

```bash
ip link set wlp3s0 down
# Release addr locally
dhclient -r wlp3s0
rfkill
```



#

Blogpost

  7 nspawn_args=(
  8   --help
  9 )
 10
 11 systemd-nspawn "${nspawn_args[@]}"



Enum PCMs

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



