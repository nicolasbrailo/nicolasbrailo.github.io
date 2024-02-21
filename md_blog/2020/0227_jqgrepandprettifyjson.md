# jq: grep and prettify json

@meta publishDatetime 2020-02-27T08:00:00.001+01:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2020/02/jq-grep-and-prettify-json_27.html

If you don't use [jq](https://stedolan.github.io/jq/manual/), you are missing a very important utility in your bash toolset. jq let's you query and filter json files from a cli. Just like awk or sed, js's "language" is basically write only, meaning whenever you need to do something there's a 99% chance you'll just be copy-pasting recipes from Stackoverflow until you find the one that works for you. Here are a couple of recipes I found most useful:

**cat a json file - with pretty print**

```c++
jq . /path/to/json_file
```

**Select a single key**

```c++
jq '.path.to.key'
```

The command above will return "42" for a json that looks like "{path: {to: {key: 42}}}"

**Delete all entries in an object, except for one**

```c++
jq '.foo|=bar'
```

The command above will return "{foo: {bar:''}}" for a json that looks like "{foo: {bar:'', baz: ''}}"

This is probably not even enough to get started. Luckily there's plenty of docs to read @ <https://stedolan.github.io/jq/manual/>


# Comments

---
## In reply to this post, [Vasiliy](http://www.zavyalov.nl) commented @ 2020-03-01T11:17:18.000+01:00:

Coincidence. Using recently this tool as well. Might be good to mentioned to your message:

-r .......... option to output raw format
[1] ........ indexing elements of json array

/Vasiliy

Original [published here](md_blog/2020/0227_jqgrepandprettifyjson.md).

---
## In reply to this post, [nico](md_blog/aboutme.md) commented @ 2020-03-01T11:23:24.000+01:00:

That's awesome, thanks!

Original [published here](md_blog/2020/0227_jqgrepandprettifyjson.md).

---
## In reply to this post, [Gustavo]() commented @ 2020-03-11T15:05:44.000+01:00:

Thanks. Very useful tool.

Original [published here](md_blog/2020/0227_jqgrepandprettifyjson.md).
