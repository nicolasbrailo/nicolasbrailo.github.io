# Hive speedup trick

@meta publishDatetime 2013-03-07T08:00:00.000+01:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2013/03/hive-speedup-trick.html

I've been playing around with Hive on top of Hadoop using AWS lately, but until recently I only knew about optimizing your query for better data-crunching throughput. Turns out you can also parallelize the subqueries execution, but this feature is not enabled by default.

Try running an explain on your query: if you have many root stages without dependencies then run this magic command: "set hive.exec.parallel=true", and then try your query again. If everything worked out fine you should be running multiple stages in parallel. use hive.exec.parallel.thread.number to control exactly how many stages to run in parallel.

