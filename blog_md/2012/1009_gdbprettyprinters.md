# gdb pretty printers

@meta publishDatetime 2012-10-09T09:00:00.000+02:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2012/10/gdb-pretty-printers.html

If you have ever used gdb then you know printing an stl object is useless. You'll be flooded with stuff you don't care about, and if you want to find, say, the contents of an std::vector you'll have to dive through tons of junk. It turns there's an easier way, it's called pretty printers and I have no idea why they are not included by default with gdb.

You'll need to download the pretty printers at svn co svn://gcc.gnu.org/svn/gcc/trunk/libstdc++-v3/python and then create a ~/.gdbinit like this one:

```c++
python
import sys
sys.path.insert(0, '~/gdb_prettyprinters/python')
from libstdcxx.v6.printers import register_libstdcxx_printers
register_libstdcxx_printers (None)
end
```

Have fun!

