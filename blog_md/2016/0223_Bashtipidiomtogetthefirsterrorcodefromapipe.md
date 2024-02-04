# Bash tip: idiom to get the first error code from a pipe

@meta publishDatetime 2016-02-23T08:00:00.000+01:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2016/02/bash-tip-idiom-to-get-first-error-code.html

When writing a bash script, often times you'll end up with something like this:

```bash
real_command | filter_stuff | prettify | do_something_else
```

The problem arises when you try to figure out if your command succeeded or not. If you `echo $?` you'll get the return code for the last chain in the pipe. You don't really care about the output value of do\_something\_else, do you?

I haven't found a solution I really like to this problem, but this idiom is handy:

```bash
out=`real_command` && echo $out | filter_stuff | prettify | do_something_else
echo $?
```

Now $? will hold the value of real\_command, and you can actually use it to diagnose the real problem.


# Comments

## In reply to [this post](), [denisss025]() commented @ 2016-03-15T06:00:04.000+01:00:

Have you tried set -o pipefail? Here is the description.

 If set, the return value of a pipeline is the value of the last (rightmost) command to exit with a non-zero status, or zero if all commands in the pipeline exit successfully. This option is disabled by default.

Original [published here](/blog_md/2016/0223_Bashtipidiomtogetthefirsterrorcodefromapipe.md).
