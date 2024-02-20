# Setting up a Linux GW VI: Configuring a console friendly router and
setting up static DHCP IPs

@meta publishDatetime 2013-10-31T08:00:00.000+01:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2013/10/setting-up-linux-gw-vi-configuring.html

We have so far setup a device capable of working as a router for a medium sized LAN, providing NAT, DHCP and DNS services. This is great if you have a dedicated network admin, but you may prefer something easier for casual console users. We'll see how to "refactor" your server configuration now to make it more console friendly.

### Moving DHCP config files

Since I want to keep everything together for easy administration, I will move the configuration files for DHCP to /home/router/dhcp. Changing the dhcpd.conf file itself is easy, just move the subnets declarations and add this line:

```c++
include "/home/router/dhcp/subnets.conf";
include "/home/router/dhcp/static_hosts.conf";
```

Like we did before with bind, we need to configure apparmor. vim /etc/apparmor.d/usr.sbin.dhcpd and add this two lines:

```c++
/home/router/dhcp/ rw,
/home/router/dhcp/** rw,
```

Restart apparmor service, then restart dhcpd. Everything should work just fine.

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
cd /home/router/dhcp
ln -s /var/lib/dhcp leases
```

Then you can check the hardware address in the leases/dhcpd.leases file. I created a symlink to keep this directory at hand, since it gives you a status of the current leases.

