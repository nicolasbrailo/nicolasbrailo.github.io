# Easy bind dns log analyzer

@meta publishDatetime 2012-11-13T08:00:00.000+01:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2012/11/easy-bind-dns-log-analyzer.html

Any real-programmer (tm) should be able to memorize all the static IPs in his network and should feel more comfortable using the IP to access the LAN resources, instead of those user friendly URL things. Of course, not everyone is a real-programmer (tm), and these people usually drive crazy the poor guys who do remember all the static IPs in the office. For them, the DNS was invented.

Some time ago I set up a bind9 on a spare server I had. Easy job, a side project of a boring late night. Of course, there was no point in just setting up my own TLD; I now had the power to have fun with DNS poisoning, and I could also create nice reports of the queries to the DNS server.

Having fun with a DNS might be the topic for another post, for this one I'll just focus on how to get query statistics from a bind server.

After grepping the web a little bit, I found a rather disconcerting lack of bind log analyzers. I just wanted a list of the most popular queries, as well as the ability to group the log by it's IP (and may be even to get the computer's SMB name). Couldn't have asked for a better chance to flex a little bit my Ruby-foo, and here is the hackish result for whoever may want to do something similar:

[source lang="ruby"]#!/usr/bin/ruby1.8

class Hits
 def initialize(n,v,k=nil)
 @n=n
 @v=v
 @k=k
 end

 def n() @n; end
 def v() @v; end
 def k() @k; end

 def <(o) @n < o.n; end
end

if ARGV.length == 0 then
 puts "Usage: dns.rb DNS\_LOG [--domains] [--ip [--no-samba]]"
 puts " --domains will list all queried domains"
 puts " --ip will list every query gruoped by IP"
 exit
end

@domains = @ip = @nosamba = false
ARGV.each { |arg|
 case arg
 when '--domains' then @domains = true
 when '--ip' then @ip = true
 when '--no-samba' then @nosamba = true
 end
}

fp = File.open ARGV[0]

queries\_by\_ip = {}
queries\_by\_domain = {}

fp.each\_line { |l|
 v = l.split(' ')
 if not (v.nil? or v.length < 4) then
 ip = v[1].split('#')[0]
 query = v[3]

 if queries\_by\_domain[query].nil? then queries\_by\_domain[query] = 0 end
 queries\_by\_domain[query] += 1

 if queries\_by\_ip[ip].nil? then queries\_by\_ip[ip] = [] end
 queries\_by\_ip[ip].push query
 end
}

if @domains then
 hits = []
 queries\_by\_domain.each { |k,v|
 hits.push Hits.new(v, k)
 }

 hits.sort!.reverse!.each { |h|
 puts h.v + " has " + h.n.to\_s + " hits"
 }
end

if @ip then
 lst = []
 queries\_by\_ip.each { |ip,queries|
 lst.push Hits.new(queries.length, ip, queries)
 }

 lst.sort!.reverse!.each { |h|
 puts "Report for " + h.v + ", Samba addr:"
 if not @nosamba then Kernel.system "nmblookup -A " + h.v end
 puts "Requested " + h.n.to\_s + " URLs:"
 h.k.uniq.each { |url|
 puts "t" + url
 }
 puts "."
 puts "."
 }
end


---
## In reply to [this post](), [GLR]() commented @ 2013-02-11T18:53:51.000+01:00:

It seems they are some issues with HTML codes in this code, can you please repost a cleaned version ?
I would be interested to test it...

Original [published here](/blog_md/2012/1113_Easybinddnsloganalyzer.md).

---
## In reply to [this post](), [nicolasbrailo](/blog_md) commented @ 2013-02-12T11:12:29.000+01:00:

Every single time I migrate blogs... anyway, it should work now. Haven't tested it, though. Let me know if you found it useful.
Cheers

Original [published here](/blog_md/2012/1113_Easybinddnsloganalyzer.md).

---
## In reply to [this post](), [GLR]() commented @ 2013-02-12T19:13:13.000+01:00:

Thx. But I'm still encountering a problem :

./bind-dns-log-analyzer:14: syntax error, unexpected tIVAR, expecting tCOLON2 or '.'
 def (o) @n o.n; end
 ^
./bind-dns-log-analyzer:15: syntax error, unexpected kEND, expecting $end

Original [published here](/blog_md/2012/1113_Easybinddnsloganalyzer.md).

---
## In reply to [this post](), [nicolasbrailo](/blog_md) commented @ 2013-02-13T10:43:08.000+01:00:

You're right, looks like the method name on line 14 is gone. I assume it's something like "def <(o) @n instead. Unfortunately I don't have a dns bind log to test it... let me know if you find out which one it is.

Original [published here](/blog_md/2012/1113_Easybinddnsloganalyzer.md).

---
## In reply to [this post](), [mcdir](http://statdns.nedze.com) commented @ 2013-11-16T10:24:08.000+01:00:

See also http://statdns.nedze.com, https://github.com/mcdir/statdnslog. But they use myskk for data storage (

Original [published here](/blog_md/2012/1113_Easybinddnsloganalyzer.md).

---
## In reply to [this post](), [nicolasbrailo](/blog_md) commented @ 2013-11-18T10:53:15.000+01:00:

Thanks mcdir. That project looks like much less of a hack than mine. In my defense, it didn't exist back then :)

Original [published here](/blog_md/2012/1113_Easybinddnsloganalyzer.md).

---
## In reply to [this post](), [mcdir](http://statdns.nedze.com/) commented @ 2013-11-18T11:54:14.000+01:00:

I'll just be happy if my program will enjoy anyone. Another demo was made available http://demo.statdns.nedze.com/

Original [published here](/blog_md/2012/1113_Easybinddnsloganalyzer.md).
