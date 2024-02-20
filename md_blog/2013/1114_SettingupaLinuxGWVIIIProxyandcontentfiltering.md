# Setting up a Linux GW VIII: Proxy and content filtering

@meta publishDatetime 2013-11-14T08:00:00.000+01:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2013/11/setting-up-linux-gw-viii-proxy-and.html

Now that we have a basic gateway we can do crazy stuff, like installing a proxy. You may want to manually configure a proxy for each client, but you can also choose to install a transparent proxy for all your users. This can be done with squid, let's see how.

Start by installing squid on your gateway. You can choose a different machine, but you'll have to do some magic with iptales. It's easier to just use the same machine.

Once squid is installed head to /etc/squid/ to vim squid.conf. Yes, it's very scary to see such a long config file, but it's mostly just comments. Luckily squid has reasonable defaults, so you can just ignore most of this file. Just to test if your squid installation was successful, before changing anything, you can tail -f /var/log/squid/access.log and set your browser's proxy to your gateway's IP, port 3128 (squid's default port). If everything works you should be able to browse and also see the access logs scrolling by.

If you are getting a 'denied' page on every request, you may have to configure squid to allow http access. Search for the 'http\_access deny all' and comment it. You may also have to search for the local networks definitions and set it up correctly (something like 'acl localnet src 192.168.0.0/24').

Once you have verified that your proxy is working, you can configure it to run on transparent mode. Search for the http\_port directive, and change it to something like 'http\_port 8213 transparent' (noticed I changed the default port). It is also a good practice to specify IP and port, so squid can bind only to the local interface (you are probably not interested in serving as a proxy for the outside world, unless you plan to run a reverse proxy).

Changing squid to run on transparent mode is not enough, though. You will also need to tell your router to redirect every incoming packet from port 80 to squid. Assuming your LAN is on the 192.168.10.0/24 address and squid is listenning on port 1234, you can use this magic command to setup your iptables rule:

```c++
iptables -t nat -A PREROUTING -s 192.168.10.0/24 -p tcp --dport 80 -j DNAT --to :1234
```

If this doesn't work for you, or you want a more detailed explanation, you can check [my post about this iptables rule](md_blog/2012/1106_Redirectingconnectionsfromoneporttoanotherwithiptables.md).

Everything ready, you should be able to unconfigure the proxy from your browser and start using squid right away, no configuration needed. tail -f /var/log/squid/access.log for hours of (thought-policing) fun.

### Adding a content filter to squid

Now that you have a gateway and a transparent proxy, it's time to install a content filter too. It's not hard, just go to your squid's config file and search for the acl section. Over there, add the following two lines:

```
acl blocksites url_regex "/home/router/blocked_sites.acl"
http_access deny blocksites
```

This will include the blocked\_sites.acl file and deny access to every URL on it. There are many [blacklist](md_blog/youfoundadeadlink.md) services out there, from which you can download a nice filter to suit your needs.

Of course, you probably don't want to restart squid each time a new site is added to your blocklist. For this you can use "squid -k reconfigure" to make squid reload its configuration.

Some random tips for squid:
* If you think your squid is responding too slowly, you can manually setup your DNS servers. Considering squid will most likely be installed on the gateway, it might be easier to just use the gateway's gateway for the DNS, instead of the bind service running on the box. You can set this option with the directive "dns\_nameservers xxx.xxx.xxx.xxx yyy.yyy.yyy.yyy" on squid.conf.
* The TCP\_MISS on the access.log means that a request was successfully served, but the content was not cached. You can review your cache limits if you get this message too much, may be you can increase the caching limit.
* You don't need to restart squid each time you change the configuration. That would be ackward if you have a lot of users. Try "squid -k reconfigure" instead.

