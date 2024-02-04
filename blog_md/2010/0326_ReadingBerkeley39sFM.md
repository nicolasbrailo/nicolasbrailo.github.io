# Reading Berkeley&#39;s FM

@meta publishDatetime 2010-03-26T08:00:00.000+01:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2010/03/reading-berkeley-fm.html

I got this from [Oracle Berkely DB's](http://www.oracle.com/technology/documentation/berkeley-db/db/programmer_reference/BDB_Prog_Reference.pdf) [FM](/blog_md/youfoundadeadlink.md):

```c++
  skey-&gt;size = sizeof((struct student_record *)pdata-&gt;data)-&gt;last_name;
```

Take a good look at that pice of code:

```c++
  a_number = sizeof((T*)pdata-&gt;data)-&gt;last_name;
```

Again:

```c++
  a_number = sizeof(Whatever)-&gt;field;
```

Wait a minute. typeof(sizeof(x)) == const unsigned int. Right? So, again:

```c++
  a_number = 42-&gt;field;
```

There's no way that first line can compile. Go and check it (in the example, not the last line please). I'll wait. Done? Yeap, I was surprised to, it does indeed compile. Mi first reaction towards this discovery went something like this:

What is going on there? It took me a while to figure out how evil Berkely 's manual can be. The answer next time.


---
## In reply to [this post](), [Nicolás Brailovsky » Blog Archive » Operator sizeof (AKA Reading Berkeley’s FM, take II)](/blog_md/2010/0329_OperatorsizeofAKAReadingBerkeleysFMtakeII.md) commented @ 2010-03-29T11:57:18.000+02:00:

[...] Last time I told you about an evil snipet I found on Oracle Berkeley DB’s manual: [...]

Original [published here](/blog_md/2010/0326_ReadingBerkeley39sFM.md).
