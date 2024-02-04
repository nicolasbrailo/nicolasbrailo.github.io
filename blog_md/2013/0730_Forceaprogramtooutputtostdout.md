# Force a program to output to stdout

@meta publishDatetime 2013-07-30T09:00:00.000+02:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2013/07/force-program-to-output-to-stdout.html

Silly but handy CLI trick on Linux: Some programs don't have an option to output to stdout. Gcc comes to mind. In that case the symlink '/dev/stdout' will come in handy: /dev/stdout will be symlinked to stdout for each process.

With this trick you could, for example, run "gcc -S foo.cpp -o /dev/stdout", to get the assembly listing for foo.cpp.

You probably shouldn't use this trick on anything other than CLI scripting stuff (keep in mind /dev/stdout might be closed or not accessible for some processes).

