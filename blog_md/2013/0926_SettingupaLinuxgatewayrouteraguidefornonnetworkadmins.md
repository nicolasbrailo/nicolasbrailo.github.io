# Setting up a Linux gateway/router, a guide for non network admins

@meta publishDatetime 2013-09-26T09:00:00.000+02:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2013/09/setting-up-linux-gatewayrouter-guide.html

Setting up a Linux GW or router is not as hard as it may seem, as long as you are reading a friendly enough guide. Yes, there are a lot of guides for this, but since I needed to document how I did it, I might as well write a post about it here. My addition to the usual "setting up a linux gw guide": I'll do it using Virtualbox first, so I can test my setup before actually deploying it.

I'm going to write about how can you setup a regular Linux distro to be your border router/gateway for your LAN, but for easy of use I'll base my examples on Ubuntu.

As expected, if we are going to replace a device, say, a router, we need to replace it with something that can provide the same functionality. In this case, we have chosen a Linux server, so we need to figure out which services are provided by the router and then emulate them someway:
* DHCP to manage leases
* DNS to translate domains to IPs
* NAT, to multiplex a single connection
* Service forwarding, to expose internal services to an external network

Luckily Linux supports all of these:
* ISC for DHCP
* bind9 for DNS
* iptables for NAT
* iptables again, for service forwarding

We'll be setting up each of these services in the next posts, for now:
### Preliminary work, the hardware setup

Before you setup any services, you are going to need two things: first two network cards, one for the outgoing connection and another one for the (switched) LAN, and a way of telling your server that you want all traffic from network 1 forwarded to network 2. You may want to install more than two cards, in case you need to route several LANs. We'll see that later.

You will also need an OS. I have chosen Ubuntu because it's very simple to install, and has all the software we need available in the repositories, but you can use any other distribution if it suits your needs.

Also, throughout this guide I will assume a setup like this:
* WAN access through eth0, DHCP address
* LAN routing in eth1, network 192.168.10.1/24

### If you don't have all this hardware...

Not everyone may have two spare desktops with three NICs ready for testing. Even if you do, you may be too lazy to setup the physical part of your network. If this is your case, you can also setup a virtual machine to emulate your setup, and Virtualbox is great for the task:
1. Begin by creating what will be your router VM.
2. Enable the first network adapter. This one should be able to see your physycal router (i.e. connect to a WAN).
3. Enable a second network adapter. Use the 'Internal network' option in the 'Attached to' field. This will be your LAN interface.
4. Create a second VM. This one will be your client.
5. Enable a single network adapter, attached to an internal network as well. The name for this network should match that of the other VM.

You are all set now, with this virtual setup you can begin setting up your router. We'll see how next time.

