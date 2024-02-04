# False sharing in multi threaded applications

@meta publishDatetime 2012-11-19T08:00:00.000+01:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2012/11/false-sharing-in-multi-threaded.html

Concurrent programing is hard. Very hard. But every once in a while you can actually find a textbook problem, an application for which a parallel algorithm is not only simple but also intuitive, so clear that it would be difficult to actually do it any other way. You put on your high speed helmet and fasten your seatbelt, ready for an FTL (faster than lineal) jump.

Running make && make test only show lower numbers. You actually decreased the performance of your application, by making it multi-threaded! How can this be possible?

While writing concurrent algorithms there are many places where you can fail, miserably. Contention is only one of them, but this is a very subtle way of failure; it will render your concurrent algorithms into a very complicated sequential algorithm, run in many cores. How can a simple concurrent algorithm turn into such a mess?

In many cases, false sharing is the culprit of the lost performance. How exactly? Let's write a simple example for this:

```c++
void lots_of_sums(unsigned idx, int v[])
{
	const unsigned itrs = LOTS;

	for (int i=0; i &lt; itrs; ++i)
		v[idx].num = i;
}
```

Imagine this function, one running in each core and v defined as a simple array. We can expect this to have a linear scalability, right? Turns out it's not that simple. Why? Let's see how v is laid out in memory:

```
+------------+--+--+--+------+-----------------+
|Random stuff|V0|V1|V2|...|VN|More random stuff|
+------------+--+--+--+------+-----------------+
```

So, v will (most likely) be made of adjacent chunks in memory. We can also assume that sizeof(v[i]) will be 4 or 8 bytes, or something small like that. Why is that important?

Remember that nowadays a CPU core is amazingly fast, so much that they make main memory look like dial up. To avoid waiting for the main memory to complete a request, several levels of cache exists. These caches know nothing about your application (well, mostly) so they can't know that v0 and v1 are actually different variables. Notice how this would apply if instead of a vector they were two random variables which happen to be allocated spatially close.

If the CPU cache, L1 for the friends, can't know that v0 and v1 are separate, it will probably try to cache a whole chunk of memory. Say, maybe 64 or 128 bytes. Why should you care?

Let's go back to our code. When you see this

```c++
...
	v[idx].num = i;
...
```

you just see independent accesses to different variables. What will the cache see? Let's go back to our memory layout, but this time let's make up an offset too:

```
0xF00    0xF10  0xF14...                   0xF40
+------------+--+--+--+------+-----------------+
|Random stuff|V0|V1|V2|...|VN|More random stuff|
+------------+--+--+--+------+-----------------+
```

So, if we assume a 64 byte cache line, then how might the CPU see a read-write process for v[0]? Something like this, probably:

```
 +---------+-------------------+----------------------------+---------------------------+
 |  C Code |       CPU         |             L1             |        Main Memory        |
 |---------|-------------------|----------------------------|---------------------------|
 |         |                   |                            |                           |
 |Read v[0]|                   |                            |                           |
 | +------+|                   |                            |                           |
 |       +-> Hey, get me 0xF10 |                            |                           |
 |         | +----------------+|                            |                           |
 |         |                  +> Huh... I don't have 0xF10, |                           |
 |         |                   | let me get that for you... |                           |
 |         |                   |  +-----------------------+ |                           |
 |         |                   |                          +-> 0xF00... yup, here you go |
 |         |                   |                            |                           |
 |         |                   |  I have it now!            |                           |
 +---------+-------------------+----------------------------+---------------------------+

```

Note an important bit there: the CPU requested 0xF10 but L1 cached the whole segment, from 0xF00 to 0xF40. Why is that? It's called [spatial locality or locality of reference](http://en.wikipedia.org/wiki/Locality_of_reference) and since it's not the main goal of this article I'll just say that L1 will cache the whole segment just in case you want it.

So far so good. What happens when you add more CPUs and write OPs? Remember that write OPs are cached as well.

Looks pretty similar, but note an interesting thing: CPU1 will read v[0], which translates to 0xF10, whereas CPU2 will read v[1], which translates to 0xF14. Even though these are different addresses, they both correspond to 0xF00 segment, thus L1 will have actually read the same chunk of memory!

The problem with this starts when a thread needs to write. Like this:

![](/blog_img/memread21.png)
Wow, a simple read from L1 cache now fails because it's been marked as dirty by an L1 from another CPU. How crazy is that? (\*)

Can you see now why our simple and elegant parallel algorithm has turned into a messy lineal... steaming pile of code? Each time a core tries to write to his own variable, it's inadvertently invalidating the variables other cores need. This is called false sharing, and we'll see a fix next time.

 (\*) Disclaimer: this diagram, and the ones before, are simplifications of what actually happens. In reality there are several levels of cache, and some of those may be shared between cores, so most likely the L1 won't need to go to main memory. Also, even in the case where there is no shared cache between cores, there are [cache coherency protocols](http://en.wikipedia.org/wiki/Cache_coherence) which will most likely avoid a read from main memory.

