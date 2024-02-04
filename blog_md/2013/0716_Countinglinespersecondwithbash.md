# Counting lines per second with bash

@meta publishDatetime 2013-07-16T09:00:00.000+02:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2013/07/counting-lines-per-second-with-bash.html

The other day I wanted to quickly monitor the status of a production nginx after applying some iptables rules and changing some VPN stuff. It's easy to know if you completely screwed up the server: the number of requests per second will drop to zero, all requests will have an httpstatus different from 200, or some other dramatic and easy to measure side effect.

What happens if you broke something in a slightly more subtle way? Say, you screwed up something in ipsec (now, I wonder how that can happen...) and now networking is slow. Or iptables now enforces some kind of throttling in a way you didn't expect. To detect this type of errors I wrote a quick bash script to output how many lines per second are added to a file. This way I was able to monitor if the throughput of my nginx install didn't decrease after my config changes, without installing a full fledged solution like zabbix.

I didn't find anything like this readily available, so I'm posting it here in case someone else finds it useful.

```c++
#!/bin/bash

# Time between checks
T=5

# argv[1] will be the file to check
LOG_FILE=$1

while true; do
    tmp=`mktemp`
    # tail a file into a temp. -n0 means don't output anything at the start so
    # we can sleep $T seconds and we don't need to worry about previous entries
    tail -n0 -f $LOG_FILE &gt; $tmp 2&gt;/dev/null &amp; sleep $T;
    kill $! &gt; /dev/null 2&gt;&amp;1;
    echo "Requests in $LOG_FILE in the last $T seconds: `cat $tmp | wc -l`";
    rm $tmp;
done
```

