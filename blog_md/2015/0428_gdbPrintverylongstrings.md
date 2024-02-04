# gdb: Print very long strings

@meta publishDatetime 2015-04-28T09:00:00.000+02:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2015/04/gdb-print-very-long-strings.html

gdb defaults are usually quite sensible and just "let you work". Some times, though, your project is not very sensible and you have to do weird things in gdb. An example: printing huge strings or vectors to try and reproduce a heisenbug. A lot of people get surprised at first because gdb will refuse to print very long strings, printing only the first few chars. Same for vectors. And if you have many repeating elements (eg "f000000000000000000000000000000bar") you might see something like "fooo0bar".
Just type these magic commands to see the whole string:

```c++
&gt; set print repeats 0
&gt; set print elements 0
```

