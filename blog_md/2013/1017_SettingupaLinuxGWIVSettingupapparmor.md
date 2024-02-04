# Setting up a Linux GW IV: Setting up apparmor

@meta publishDatetime 2013-10-17T09:00:00.000+02:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2013/10/setting-up-linux-gw-iv-setting-up.html

Apparmor is a service that runs in the background, checking what other binaries can and can't do. For example, it will allow bind9 to open a listening socket on port 53 (DNS), but it will deny an attempt to open a listening socket on port 64. This is a security measure to limit the damage a compromised bind9 binary running as root might do. And since we are going to use a non standard configuration, we need to tell apparmor that it's OK.

After installing bind9 we should get a new file in /etc/apparmor.d/usr.sbin.named. Add the following lines at the bottom:

```c++
  /home/router/named/** rw,
  /home/router/named/ rw,
```

And restart apparmor service:

```c++
/./etc/init.d/apparmor restart
```

Since we were modifying apparmor to allow a non-standard bind installation, now restart bind too. This time it will start without any errors, and you should be able to tail -f /home/router/named/dns.log to see the DNS queries on real time. If it doesn't, check that /home/router/named is writable to the bind user (I did a chgrp -R bind named).

