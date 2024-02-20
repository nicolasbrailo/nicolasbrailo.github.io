# Bash scripting and getops

@meta publishDatetime 2013-06-06T09:00:00.000+02:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2013/06/bash-scripting-and-getops.html

Did you ever write a bash script and thought it looked too clean? Yeah, me neither. Anyway, now you can make it look even worse by using getopt. As an upside, you'll be able to read command line options from a user without having to resort to nasty hacks, like hardcoding the switch position into the argv.

getopt should be installed by default in most Linux distros, and you can even run it as a command line program. It's quite easy to use on a bashcript. For example, something like:

```c++

while getopts "bar" opt; do
    case "$opt" in
        b) echo "Option b is set"
           ;;
        a) echo "Option a is set"
           ;;
        r) echo "Option r is set"
           ;;
    esac
done

```

It won't look pretty but it does get the job done. According to "man getopt" it supports things like short & long options and defaults; if you need something more complex, you should probably be using a proper language instead of a bash script.

