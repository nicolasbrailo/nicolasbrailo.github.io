# smaps: A quick memory analysis

@meta publishDatetime 2016-02-18T08:00:00.000+01:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2016/02/smaps-quick-memory-analysis.html

Many times you see your process' memory consumption skyrocketing even though you're quite certain you have no memory leaks. This usually marks for the beginning of a very lengthy debugging process with valgrind or a similar tool, but even so some times you might get stuck trying to debug some third party library.

There's a quick tip in Linux that can help you track down a lib gone haywire:

```c++
cat /proc/&lt;pid&gt;/smaps
```

smaps will report every mapped section of memory for a certain process, how big the memory allocation is and which binary created the allocation.

