# Wifi from the CLI

@meta publishDate 2024-03-01
@meta author Nico Brailovsky
@meta tags Bash, Fixing things, Linux

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
