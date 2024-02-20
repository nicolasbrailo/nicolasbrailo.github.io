# Setting up a Linux GW II: NATting and forwarding

@meta publishDatetime 2013-10-03T09:00:00.000+02:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2013/10/setting-up-linux-gw-ii-natting-and.html

For our Linux GW, services like DNS and DHCP are nice-to-have, but having real connectivity is way more important. Let's set up the NAT and connection forwarding features of the new router, then we can test if our setup is working properly by pinging an IP of one LAN from the other.

We'll do this by setting up NAT with iptables. We'll also have to configure the OS to forward connections from one network card to the other:

```c++
echo 1 > /proc/sys/net/ipv4/ip_forward
iptables --table nat --append POSTROUTING --out-interface eth0 -j MASQUERADE
# Add a line like this for each eth* LAN
iptables --append FORWARD --in-interface eth1 -j ACCEPT
```

We will also need to setup the IP for eth0, since there won't be a DHCP server (we ARE the server!). Open /etc/network/interfaces and add something like this:

```c++
# Configure the WAN port to get IP via DHCP
auto eth0
iface eth0 inet dhcp
# Configure the LAN port
auto eth1
iface eth1 inet static
	address 192.168.10.1	# (Or whatever IP you want)
	netmask	255.255.255.0	# Netmasks explanations not included
```

Once that's checked, restart networking services like this:

```c++
sudo /./etc/init.d/networking restart
```

Everything ready, now just plug your PC to the new router and test it. Remember to manually set your IP in the same network range as your router, since there's no DHCP at the moment. This may be useful to debug a problem.

In your client PC, set your IP address:

```c++
ifconfig eth0 192.168.10.10
```

Test if you IP is set:

```c++
ping 192.168.10.10
```

If you get a reply, your new IP is OK, if not there's a problem with your client. Second step, see if you can reach the router:

```c++
ping 192.168.10.1
```

Note that you may need to renew everything (i.e. restart networking and manually assign your IP) after you connect the cable.

Again, if you get a reply then you have connectivity with the router. So far we haven't tested the iptables rules nor the forwarding, so any issue at this point should be of IP configuration. If everything went well, it's time to test the NAT rules and the forwarding.

```c++
ping 192.168.1.1
```

That should give you an error. Of course, since there's no DHCP there's no route set. Let's manually set a route in the client:

```c++
sudo route add default gateway 192.168.10.1
```

Then again:

```c++
ping 192.168.0.1
```

Magic! It works! If it doesn't, you have a problem either in the NAT configuration or the IP Forwarding of the router. You can check this with wireshark, if the pings reach the server but they never get a reply back then it's the NAT, i.e. it can forward the IP packages on eth1 to eth0 but the router has no NAT, and it doesn't know how to route the answer back. If the pings never even reach eth0, then you have an ip forwarding problem.

### Persisting the forwarding rules

In order to have the forwarding rules persisting after a reboot, we need first to change /etc/sysctl.conf to allow IP forwarding. It's just a mater of uncommenting this line:

```c++
net.ipv4.ip_forward = 1
```

We will also have a lot of iptables rules we need to setup during boot time. I have created a script at /home/router/set\_forwarding.sh, which I also linked into /etc/init.d/rc.local so it's run whenever the system boots.

Next time we'll move on to something more complex: installing a DNS server and using domains instead of IPs.

