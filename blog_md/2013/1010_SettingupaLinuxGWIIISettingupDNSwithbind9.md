# Setting up a Linux GW III: Setting up DNS with bind9

@meta publishDatetime 2013-10-10T09:00:00.000+02:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2013/10/setting-up-linux-gw-iii-setting-up-dns.html

If you have been following my series on how to install a Linux based router, you should now have a setup where a client is able to see the outside world via a router. We can try something more complex now, like pinging a domain instead of an IP. Something like this:

```c++
ping google.com
```

You should get a message saying the host is unknown. Can you guess why? Right, there's no DNS.

### Setting up DNS

DNS will be necessary to resolve domains to IPs. bind9 is the default option for Debian based servers (are there others? no idea).

```c++
sudo apt-get install bind9
```

This will get your DNS server up and running, but you will still need to add this server manually to your client (again, because there's no DHCP running):

```c++
sudo echo "nameserver 192.168.10.1" &gt; /etc/resolv.conf
```

And now:

```c++
ping google.com
```

Magic again, it (may) work. If it doesn't, you may need to open /etc/bind/named.conf and setup your router (192.168.0.1) as a forwarder, then restart the bind server.

Of course this is rather boring. If you are going to install a DNS you might as well create a custom TLD for your LAN.

### Setting up a custom TLD with bind9 for your LAN

So far on the series about how to install a Linux based router, we set up a Linux router with NAT and a basic DNS. Now we'll setup a custom TLD, so you can have custom domains for your LAN. For example, if you want your router to have a nice user friendly name, instead of just an IP.

Let's start by adding a local zone to /etc/bind/named.conf.local, for a domain we'll call "lan":

```c++
zone "lan" {
        type master;
        file "/home/router/named/lan.db";
};
```

Now we need to add a reverse zone. Note how the name is the IP reversed:

```c++
zone "10.168.192.in-addr.arpa" {
	type master;
        file "/home/router/named/rev.10.168.192.in-addr.arpa";
};
```

We still need to create both files (lan.db and rev.10.168.192.in-addr.arpa), but will do that later. Lets setup a place to log all the DNS queries (optional):

```c++
logging {
    channel query.log {
        file "/home/router/named/dns.log";
        severity debug 3;
		  print-time yes;
    };

    category queries { query.log; };
};
```

For the log entry I have chosen /home/router/named as the log directory, just because for this project I'm keeping everything together (config and logs) so it's easy for people not used to administer a Linux box, but of course this means that apparmor must be configured to allow reads and writes for bind in this directory. We'll get to that in a second, first let's create the needed zone files for our new TLD.

Remember our two zone files? I put them on /home/router/named, but usually they are on /etc/bind. Again, I did this so I can have all the config files together. These are my two files:

For lan.db

```c++
lan.      IN      SOA     ns1.lan. admin.lan. (
                                                        2006081401
                                                        28800
                                                        3600
                                                        604800
                                                        38400
 )

lan.      IN      NS              ns1.lan.

wiki             IN      A       192.168.0.66
ns1              IN      A       192.168.0.1
router           IN      A       192.168.0.1
```

For rev.10.168.192.in-addr.arpa

```c++
@ IN SOA ns1.lan. admin.example.com. (
                        2006081401;
                        28800;
                        604800;
                        604800;
                        86400
)

                     IN    NS     ns1.lan.
1                    IN    PTR    lan
```

Most of these lines are black magic, and since an explanation of both DNS and Bind is out of scope (feel free to read the RFC if you need more info) let's just say you can add new DNS entries by adding lines like this:

```c++
NICE_NAME           IN      A       REAL_IP
```

This will make bind translate NICE\_NAME.lan to REAL\_IP. Of course, this will depend on the TLD you defined. Now restart bind to get a crapton of errors. It will complain about not being able to load a master file in /home/router/named. Remember that apparmor thing I mentioned?

