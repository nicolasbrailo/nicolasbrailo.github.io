# Using masqd for custom subdomains

@meta publishDatetime 2012-12-18T08:00:00.000+01:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2012/12/using-masqd-for-custom-subdomains.html

Some time ago I had to work on a project with many, and dynamic, subdomains. Things like sub1.domain, sub2.domain, subN.domain. It turns out /etc/hosts doesn't support wildcards. That sucks, but its understandable, that's not why the hosts file is there; that's the reason we have DNS, isn't it?

Of course installing a DNS server just to resolve a couple of subdomains is much too work for lazy people like me, so it's time to install dnsmasq instead. dnsmasq is a DNS and DHCP proxy, and has a ton of configuration options I don't even know about. If you really want to learn how to use masqd you should read its manpage, if you just want to solve your DNS issues just add "address=/.DOMAIN/IP" to your /etc/dnsmasq.conf (notice the . before the domain. That's the wildcard).

