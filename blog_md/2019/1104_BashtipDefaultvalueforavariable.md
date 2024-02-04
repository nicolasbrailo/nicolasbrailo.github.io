# Bash tip: Default value for a variable

@meta publishDatetime 2019-11-04T20:00:00.001+01:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2019/11/bash-tip-default-value-for-variable_4.html

In my Bash scripts, I used to hack my way around default values for variables. Turns out there is a very simple way to give your variables a default value while also letting other override them if they want to:

```
FOO=${BAR-bar}
```

If someone export's BAR, then FOO will equals the already exported value of $BAR, if $BAR doesn't exist then FOO will have the value of the literal 'bar'.

