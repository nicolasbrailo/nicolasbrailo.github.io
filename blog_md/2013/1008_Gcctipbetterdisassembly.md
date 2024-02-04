# Gcc tip: better disassembly

@meta publishDatetime 2013-10-08T09:00:00.000+02:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2013/10/gcc-tip-better-disassembly.html

Few things are more awesome than compiling with "g++ -S" and inspecting gcc's dissasembly and learn how the compiler optimizes things you wouldn't even think about. Unfortunately, the assembly might not be the most human friendly format for a program (though I've seen worse).

While you won't escape the need to learn some assembly to get any meaningful information out of gcc's assembly listing, there are some tips which might make your life much easier:

C++ filt
--------

c++filt is part of the build essentials package, and will turn mangled names into proper C++ names. You won't need to remember that \_Znwm is the mangled version of "operator new", just run "g++ -E foo.cpp -o /dev/stdout | c++filt" and you'll get an assembly with unmangled names.

fverbose-asm
------------

Some people have the ability to read assembly and automatically understand how the data flows between registers and variables very quickly. For the mere mortals like us, gcc has a very helpful flag called "-fverbose-asm" which will add a comment to each line where a variable is referenced. This will let you keep track of the data flow inside a function.

Extra, unrelated, tip:
----------------------

As far as I know, gcc has no option to write to stdout; just use "-o /dev/stdout" to let it write to a fake file which Linux will helpfully create for you, then you can pipe the hell out of gcc's output.

