# Setting up a Linux gateway/router

@meta publishDatetime 2012-12-25T08:00:00.000+01:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2012/12/setting-up-linux-gatewayrouter.html

Yes, there are a lot of guides for this, but since I need to document how I did it for my office a lot of time ago, I might as well write a post about it here.

As expected, if we are going to replace a device, say, a router, we need to replace it with something that can provide the same functionality. In this case, we have chosen a Linux server, so we need to figure out which services are provided by the router and then emulate them someway:

* DHCP to manage leases
* DNS to translate domains to IPs
* NAT, to multiplex a single connection
* Service forwarding, to expose internal services to an external network

Luckily Linux supports all of these:

- ISC for DHCP
- bind9 for DNS
- iptables for NAT
- iptables again, for service forwarding

Let's set up each of these services.

### Preliminary work

Before you setup any services, you are going to need two things: first two network cards, one for the outgoing connection and another one for the (switched) LAN, and a way of telling your server that you want all traffic from network 1 forwarded to network 2. You may want to install more than two cards, in case you need to route several LANs. We'll see that later.

You will also need an OS. I have chosen Ubuntu because it's very simple to install, and has all the software we need available in the repositories, but you can use any other distribution if it suits your needs.

Also, throughout this guide I will assume a setup like this:

	* WAN access through eth0, DHCP address
	* LAN routing in eth1, network 192.168.10.1/24
### Setting up NATting and forwarding

Services like DNS and DHCP are nice-to-have, but having real connectivity is way more important. Let's set up the NAT and connection forwarding features of the new router, then we can test if our setup is working properly by pinging an IP of one LAN from the other.

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

We can try something more complex now, like pinging a domain instead of an IP. Something like this:

```c++
ping google.com
```

You should get a message saying the host is unknown. Can you guess why? Right, there's no DNS. Let's install one, but first we have to make these changes permanent.

### Persisting the forwarding rules

In order to have the forwarding rules persisting after a reboot, we need first to change /etc/sysctl.conf to allow IP forwarding. It's just a mater of uncommenting this line:

```c++
net.ipv4.ip_forward = 1
```

We will also have a lot of iptables rules we need to setup during boot time. I have created a script at /home/router/set\_forwarding.sh, which I also linked into /etc/init.d/rc.local so it's run whenever the system boots.

### Setting up DNS

DNS will be necessary to resolve domains to IPs. bind9 is the default option for Debian based servers (are there others? no idea).

```c++
sudo apt-get install bind9
```

This will get your DNS server up and running, but you will still need to add this server manually to your client (again, because there's no DHCP running):

```c++
sudo echo "nameserver 192.168.10.1" > /etc/resolv.conf
```

And now:

```c++
ping google.com
```

Magic again, it (may) work. If it doesn't, you may need to open /etc/bind/named.conf and setup your router (192.168.0.1) as a forwarder, then restart the bind server.

### Setting up a custom TLD in your DNS

Now we have a DNS running, so we can set up local zones for the LAN. For example, if you want your router to have a nice user friendly name, instead of just an IP.

Let's start by adding a local zone to /etc/bind/named.conf.local, for a domain we'll call "boc":

```c++
zone "boc" {
        type master;
        file "/home/router/named/boc.db";
};
```

Now we need to add a reverse zone:

```c++
zone "10.168.192.in-addr.arpa" {
	type master;
        file "/home/router/named/rev.10.168.192.in-addr.arpa";
};
```

We still need to create both files (boc.db and rev.10.168.192.in-addr.arpa), but will do that later. Lastly, a place to log all the DNS queries (if you want):

```c++
logging {
    channel query.log {
        file "/home/router/named/dns.log";
        severity debug 3;
    };

    category queries { query.log; };
};
```

For the log entry I have chosen /home/router/named as the log directory, just because for this project I'm keeping everything together (config and logs) so it's easy for people not used to administer a Linux box, but of course this means that apparmor must be configured to allow reads and writes for bind in this directory. We'll get to that in a second, first let's create the needed zone files for our new TLD.

Remember our two zone files? I put them on /home/router/named, but usually they are on /etc/bind. Again, I did this so I can have all the config files together. These are my two files:

For boc.db:

```c++
boc.      IN      SOA     ns1.boc. admin.boc. (
                                                        2006081401
                                                        28800
                                                        3600
                                                        604800
                                                        38400
 )

boc.      IN      NS              ns1.boc.

wiki             IN      A       192.168.0.66
ns1              IN      A       192.168.0.1
router           IN      A       192.168.0.1
```

For rev.10.168.192.in-addr.arpa

```c++
@ IN SOA ns1.boc. admin.example.com. (
                        2006081401;
                        28800;
                        604800;
                        604800;
                        86400
)

                     IN    NS     ns1.boc.
1                    IN    PTR    boc
```

Most of these lines are black magic, and since an explanation of both DNS and Bind is out of scope let's just say you can add new DNS entries by adding lines like this:

```c++
NICE_NAME           IN      A       REAL_IP
```

This will make bind translate NICE\_NAME.boc to REAL\_IP. Of course, this will depend on the TLD you defined. Now restart bind to get a fuckton of errors. It will complain about not being able to load a master file in /home/router/named. Remember that apparmor thing I mentioned?

### Setting up apparmor to allow new directories

Apparmor is a service that runs in the background, checking what other binaries can and can't do. For example, it will allow bind9 to open a listening socket on port 53 (DNS), but it will deny an attempt to open a listening socket on port 64. This is a security meassure to limit the damage a compromised bind9 binary running as root might do. And since we are going to use a non standard configuration, we need to tell apparmor that it's OK.

After installing bind9 we should get a new file in /etc/apparmor.d/usr.sbin.named. Add the following lines at the bottom:

```c++
  /home/router/named/** rw,
  /home/router/named/ rw,
```

And restart apparmor service:

```c++
/./etc/init.d/apparmor restart
```

Since we were modifying apparmor to allow a non-standard bind installation, now restart bind too. This time it will start without any errors, and you should be able to tail -f /home/router/named/dns.log to see the DNS queries on real time. If it doesn't, check that /home/router/named is writable to the bind user (I did a chgrp -R bind named).

### Setting up DHCP

We have DNS and NAT so far, but the client configuration so far has been absolutely manual. We can't have many clients with this sort of setup, so let's automate the client config with a DHCP server. Begin by installing isc-dhcp-server.

Edit /etc/dhcp/dhcpd.conf, set the domain-name and the domain-name-servers, like this:

```c++
option domain-name "boc";
option domain-name-servers ns1.boc, ns2.boc;

default-lease-time 86400;
max-lease-time 172800;

authoritative;
```

I'm not sure if the first line is needed. The other two will set the DNS servers for your clients. In my case, ns1 and ns2 resolve to 192.168.10.1 and 192.168.0.1 respectively. Also, increasing your lease time is recommended, I used one day for default leases. I set this DHCP server as the authoritative server. If this is your router, that's probably what you want.

Now we need to define the network topology:

```c++
# This is the WAN network, and we won&#x27;t provide a service here
subnet 192.168.0.0 netmask 255.255.255.0 {
}

# Define the service we provide for the LAN
subnet 192.168.10.1 netmask 255.255.255.0 {
	range 192.168.10.100 192.168.10.200;
	option routers 192.168.10.1;
}
```

Now we need to restart ISC:

```c++
sudo /./etc/init.d/isc-dhcp-server restart
```

And now we need to check if everything worked in the client. It's easy this time, we just ask for an IP:

```c++
sudo dhclient
ifconfig
```

If everything went fine, we should now have an IP in the 100-200 range, as well as the DNS server in /etc/resolv.conf. We have now setup a very basic router and should be able to server several clients for basic browsing capabilities.

### Moving DHCP config files

Since I want to keep everything together for easy administration, I will move the configuration files for DHCP to /home/router/dhcp. Changing the dhcpd.conf file itself is easy, just move the subnets declarations and add this line:

```c++
include "/home/router/dhcp/subnets.conf";
include "/home/router/dhcp/static_hosts.conf";
```

Like we did with bind, we need to configure apparmor. vim /etc/apparmor.d/usr.sbin.dhcpd and add this two lines:

```c++
/home/router/dhcp/ rw,
/home/router/dhcp/** rw,
```

Restart apparmor service, then restart dhcpd. Everything should work just fine.

### Setting up port forwardings

In any LAN you'll probably want to expose some services to the outer world, be it for a bittorrent connection or because you have internal servers you need to access from outside your internal LAN. To do this, you'll have to tell your router to forward some external port to an internal one, like this:

```c++
iptables -t nat -A PREROUTING -i eth0 -p tcp
	--dport PORT -j DNAT --to INTERNAL_IP:INTERNAL_PORT
# This rule may not be needed, depending on other chain confings
iptables -A INPUT -i eth0 -p tcp -m state --state NEW
	--dport PORT -j DNAT --to INTERNAL_IP:INTERNAL_PORT
```

This is enough to expose a private server to the world, but it will not be very useful when your dynamic IP changes. You need to set INTERNAL\_IP to be a static IP.

### Setting up static IPs

Remember the static\_hosts file we created before? We can use that to define a static IP. Add the following to set a static IP host:

```c++
host HostName {
	hardware ethernet 00:00:00:00:00:00
	fixed-address 192.168.10.50;
}
```

After that, just restart the DHCP service and renew your client's IP. Done, it's static now!

Wait a minute: how do you find the MAC for your host? I'm to lazy to copy and type it, so I did the following:

```c++
# cd /home/router/dhcp
# ln -s /var/lib/dhcp leases
```

Then you can check the hardware address in the leases/dhcpd.leases file. I created a symlink to keep this directory at hand, since it gives you a status of the current leases.

### Warm restart for the router and easy administration

We have quite a few configuration files now, with different settings for iptables, the DHCP and the DNS. If we are aiming for an easy to administer setup, we should add a restart script like this:

```c++
#!/bin/bash

./set_forwarding.sh
/./etc/init.d/bind9 restart
/./etc/init.d/isc-dhcp/server restart
```

Now anyone who changes a config file can run this script to have their new rule applied.


# Comments

---
## In reply to [this post](), [Abby Rhozabel]() commented @ 2016-04-17T19:39:23.000+02:00:

Ten computers has a public ip address How will you get internet connection on ten public computers using private ip address and linux box as its router.

Original [published here](/blog_md/2012/1225_SettingupaLinuxgatewayrouter.md).
