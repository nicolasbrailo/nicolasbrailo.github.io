# Bash traps: almost like RAII for bash

@meta publishDatetime 2015-04-16T09:00:00.000+02:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2015/04/bash-traps-almost-like-raii-for-bash.html

Everywhere, but specially in bash, cleaning up is annoying and error prone. Resource leaks can be common if your bash script is interrupted half-way. Do you need to execute something always, even if your script fails or gets killed? Try using traps:

```c++
#!/bin/bash
foobar() {
    echo "See ya!"
}
trap "foobar" EXIT
```

It doesn't mater how you end this script, "foobar" will always be executed. Want to read more about bash traps? Check [here.](/blog_md/youfoundadeadlink.md)

