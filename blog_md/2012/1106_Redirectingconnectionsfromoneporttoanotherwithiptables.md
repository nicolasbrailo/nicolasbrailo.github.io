# Redirecting connections from one port to another with iptables

@meta publishDatetime 2012-11-06T08:00:00.000+01:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2012/11/redirecting-connections-from-one-port.html

People say iptables are incredibly useful. Mind you, I have gotten mostly headaches out of it, but it is easy to see they are a powerful tool. The other day (for reasons not relevant to this post) I needed to run a service on a port, yet have it accept connections in a different port. Say, the service should be listening on port 1234, but the server should accept any connection on port 4321 and "redirect" each package to the correct port. Turns out iptables is the tool for the job.

For the impatient ones, this is the command I used:

```c++
iptables -t nat -A PREROUTING -s 192.168.10.0/24 \
         -p tcp --dport 4321 -j DNAT --to :1234
```

Let's analyze this part by part. First I tried something like this:

```c++
# Caution: This is wrong and won't work!
iptables -A INPUT -s 192.168.1.0/24 --dport 4321 --to :1234
```

Seems clear enough:
* **-A INPUT** will add this rule to the INPUT chain (i.e. the list of rules that are run for every incoming packet.
* **-s 192.168.1.0/24** will filter the packages, so this rule will only be applied to the packets incoming from the 192.168.1.0/24 network.
* **--dport 4321** will filter the packages again, so we can apply this rule not only to those packets incoming from the LAN but also to those packet to port 4321.
* **--to :1234** is the rule to rewrite the destination port.

Too bad this won't work. To begin with, the --dport option will fail, since it makes no sense to talk about ports without specifying a protocol (i.e. ports are a TCP layer concept, not an IP layer conecpt, so iptables doesn't know what to do with a --dport option!). Thus, let's rewrite our command like this:

```c++
# Caution: This is wrong and won't work!
iptables -A INPUT -s 192.168.1.0/24 -p tcp --dport 4321 --to :1234
```

Now iptables will complain about the --to option. This is because iptables can't rewrite a package (i.e. use the --to option) unless you specify to jump to the DNAT table (?). Now our command should look like this:

```c++
# Caution: This is wrong and won't work!
iptables -A INPUT -s 192.168.1.0/24 -p tcp --dport 4321 -j DNAT --to :1234
```

iptables will still complain: you can't use DNAT unless you use a nat table, so we have to add -t nat. If we do that, iptables will complain once more about not being able to use DNAT in the INPUT chain, it is only available in the PREROUTING/OUTPUT chains. This is related to the order in which iptables processes its rules.

With all this in mind, we can now write a command that will run:

```c++
iptables -t nat -A PREROUTING -s 192.168.10.0/24
         -p tcp --dport 4321 -j DNAT --to :1234
```

