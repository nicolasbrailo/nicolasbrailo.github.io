# Faking a server and testing networks with netcat

@meta publishDatetime 2012-10-11T09:00:00.000+02:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2012/10/faking-server-and-testing-networks-with.html

Not long ago I wrote about having to use iptables to redirect packets from one port to another. Testing this with a real server may be complicated, or at least inconvenient. Luckily we have netcat to help us.

If you use "nc -l 1234", netcat will create a listening socket on the port 1234. You can check if it's working by doing a "telnet IP 1234", nc should echo whatever you type on the client in the server. In the example from my article explaining an iptables rule, you would do an nc -l 1234, apply the iptables rule and the issue a "netcat IP 4321". If everything went according to plan you should be seeing the echo on your nc server.

