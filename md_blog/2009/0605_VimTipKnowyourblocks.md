# Vim Tip: Know your blocks!

@meta publishDatetime 2009-06-05T01:00:00.014+02:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2009/06/vim-tip-know-your-blocks.html

Vim is the best editor for programmers and as such it has some neat "programmer commands", which make editing source code a lot easier. Take for example a block with code, or a function definition: how many times did you have to copy the code between parenthesis from one place to the other?

```c++
int foo(int bar, int baz)
```

You could do '0f(df)' to delete "int bar, int baz" but that won't do if the definition is more complicated than that. 'dib' is a better choice to delete the text.

(ACTION)i{b|B} applies ACTION to a block, for example, pressing diB in

```c++
void foo() _ {
	/* Lots of source code */
}
```

(with the cursor placed at \_) will delete lots of source code.

