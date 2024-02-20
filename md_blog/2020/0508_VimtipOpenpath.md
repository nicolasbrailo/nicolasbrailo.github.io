# Vimtip: Open path

@meta publishDatetime 2020-05-08T19:03:00.006+02:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2020/05/vimtip-open-path_92.html

If you are editing a file which references another file (like, say, a cpp file #including a header file) then you can use Vim to open the referenced file in a new tab like this:

```c++
#include "foo/bar.h"
```

Place your cursor anywhere in "foo/bar.h" and press `gf` to open the referenced path. More interestingly, you can also do `C-w`, release and then `gf` to open in a new tab.

Today I learned you can also do this for arbitrary URLs. If you have a file like this:

```c++
#include "foo/bar.h"
// https://github.com/nicolasbrailo/Nico.rc/blob/master/README.md
...
```

Then you can do `C-w gf` on either of the first two lines! If needed, Vim will automatically fetch the referenced url for you and store it in a temp location. Magic!

