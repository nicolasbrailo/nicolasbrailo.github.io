# Setting up a Linux GW VII: Fun with iptables, setting up port
forwardings

@meta publishDatetime 2013-11-07T08:00:00.000+01:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2013/11/setting-up-linux-gw-vii-fun-with.html

In any LAN you'll probably want to expose some services to the outer world, be it for a bittorrent connection or because you have internal servers you need to access from outside your internal LAN. To do this, you'll have to tell your router to forward some external port to an internal one, like this:

```c++
iptables -t nat -A PREROUTING -i eth0 -p tcp
	--dport PORT -j DNAT --to INTERNAL_IP:INTERNAL_PORT

# This rule may not be needed, depending on other chain confings
iptables -A INPUT -i eth0 -p tcp -m state --state NEW
	--dport PORT -j DNAT --to INTERNAL_IP:INTERNAL_PORT
```

This is enough to expose a private server to the world, but it will not be very useful when your dynamic IP changes, so you'll need to set INTERNAL\_IP to be a static IP.

Of course, this commands are little less than black magic. iptables are rather complex and quite difficult to master, but as a short description we can say they are a way of applying a set of rules to incoming network packets. In iptables you have different tables of rules (in this case we use -t[able] nat) and specify that we want our rule to be applied in the PREROUTING phase. -i specifies that this rule should be applied only to packets incoming from eth0, and --dport means this rule applies only to packets incoming from a certain port. Of course, if you are going to specify a port then you need to specify the protocol (in this case, tcp).

Now we have replicated in our setup almost all the functionalities a small COTS router has. Next time we'll see how to improve that by adding a proxy.

