# Passwordless ssh

@meta publishDatetime 2011-10-25T12:01:00.000+02:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2011/10/passwordless-ssh.html

This is one of those things that are terribly easy nowadays, but since I only do it every once in a while I never remember how it's done: setting up a passwordless ssh. I won't write any explanation, just the command to set it up so I can keep it as reference for the next time I have to do it:

```c++
ssh-keygen -t rsa &amp;&amp; ssh-copy-id USR@HOST
```

You might also want to specify that HOST requires USR, instead of $(whoami), so you won't have to type ssh USR@HOST next time you want a passwordless loggin. This can be done in /etc/ssh/ssh\_config, like this:

```c++

Host $HOST
	User $USER

```

Replace as needed.

