# Console foo: Scheduling commands

@meta publishDatetime 2009-09-15T01:00:00.014+02:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2009/09/console-foo-scheduling-commands.html

You can easily schedule a command using "at", which recognizes a nicely formatted date string.

For example:
```bash
$ at today 3:00 AM
```

This will open a prompt. So, for example:

```bash
$ at today 3:30 PM
> wget foobar.com/a_huge_file
> C-D
```

Will schedule a download of a huge file, today at 3:00 AM. Nice, isn't it?
To check the whole list of accepted formats check the man for at.

One last note: at will "remember" the current environment variables, so PWD, USER, OLD\_DIR and all that will be the same. This means if you schedule a command with a relative path it'll still work!

