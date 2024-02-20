# False sharing in multi threaded applications, part II

@meta publishDatetime 2012-11-20T08:00:00.000+01:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2012/11/false-sharing-in-multi-threaded_20.html

In the last entry we learned how an apparently parallel algorithm can turn into a sequential nightmare via false sharing; what you may think to be two independent variables may actually be spatially close, thus sharing a cache line which gets invalidated by each and every write across cores. But is this a real world issue? If so, how can we fix it?

We'll work backwards: let's see first how can this be fixed, and then we'll check if this is actually a real world issue.

Remember our code sample, from last time:

```c++
void lots_of_sums(unsigned idx, int v[])
{
	const unsigned itrs = 2000*1000*1000;

	for (int i=0; i < itrs; ++i)
		v[idx].num = i;
}
```

An easy way to avoid false sharing would be to just assign i to a temporary variable, then assign the real result to v[i]; this way, you would be writing only once, the intermediate results will be in [TSS](http://en.wikipedia.org/wiki/Thread-local_storage), thus avoiding the contention in the loop.

The second strategy to solve this problem would be to use padding. Knowing that your cache line is made of 64 bytes will let you write something like this:

```c++
struct Padded {
	int num;
	char pad[60];
};
```

Of course, this has another problem: what about the offset? We need not only padding but also spacing, for the alignment.

```c++
struct Padded {
	char space[60];
	int num;
	char pad[60];
};
```

Alternatively, you could use the align keyword of C++0x, but since it's not implemented on g++ I have never tested it before, so I have no idea how it's supposed to work. For more information on this you can check [Herb Sutter's article, Eliminate False Sharing](http://drdobbs.com/go-parallel/article/showArticle.jhtml?articleID=217500206).

