# MySQL upsert, Oracle merge

@meta publishDatetime 2010-08-19T10:59:00.000+02:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2010/08/mysql-upsert-oracle-merge.html

How many times have you seen this "pattern"?

```c++
unsigned int row_count = foo-&gt;update();
if (row_count == 0) {
   foo-&gt;insert();
}
```

Wouldn't it be nice if you could write all that in a single line? Say, something like

```c++
foo-&gt;update_or_insert_if_it_doesnt_exists();
```

Well, good news, you can! Obviously it's not standard SQL, nothing useful ever is, but even so I think using an upsert (who comes up with those names?) can be quite good for your health.

So, how do you use it? It's easy;

```sql
INSERT INTO Table ( col1, col2 )
SELECT 'a', 'b'
ON DUPLICATE KEY UPDATE col1 = 'a', col2 = 'b';
```

Go on, try it, I'll wait. What? It didn't work? Oh, I forgot, you need to create a unique key so the engine can recognize when there is a duplicate key (say, 'create index unique on col1'). Try it now.

Nice, isn't it? Oracle has its own version of upsert, called merge (at least the name is better) but it itches a little bit when I write about Oracle, so go and check [this page](http://psoug.org/reference/merge.html) instead.

