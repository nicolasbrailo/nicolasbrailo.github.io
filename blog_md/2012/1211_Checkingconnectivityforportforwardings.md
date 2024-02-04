# Checking connectivity for port forwardings

@meta publishDatetime 2012-12-11T08:00:00.000+01:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2012/12/checking-connectivity-for-port.html

This is a little bit outside of what I normally post, but when I find such a terribly useful site I need to share it (so I won't forget next time I need it).

Have you ever had to set up a forwarding to expose a LAN service to the outside world? It kind of sucks not knowing if you set up everything correctly, and it's not easy to test, since you can only test if the service is working inside your LAN. Normally you would need to either bounce on a proxy outside, or ask a friend to nmap you. Alternatively, you can use [canyouseeme.org](http://canyouseeme.org/), a website that will probe a specific port on the IP you specify, and tell you if it times out or if it's open.

A great time saver.

