# Setting up a Linux GW V: DCHP

@meta publishDatetime 2013-10-24T09:00:00.000+02:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2013/10/setting-up-linux-gw-v-dchp.html

In our custom Linux router we now have DNS and NAT so far, but the client configuration has been absolutely manual. We can't have many clients with this sort of setup, so let's automate the client config with a DHCP server. Begin by installing isc-dhcp-server.

Edit /etc/dhcp/dhcpd.conf, set the domain-name and the domain-name-servers, like this:

```c++
option domain-name "lan";
option domain-name-servers 192.168.10.1 192.168.0.1;

default-lease-time 86400;
max-lease-time 172800;

authoritative;
```

I'm not sure if the first line is needed. The other two will set the DNS servers for your clients. Also, increasing your lease time is recommended, I used one day for default leases. I set this DHCP server as the authoritative server. If this is your router, that's probably what you want.

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

Next time we'll see how to tidy up everything, for easier administration.

