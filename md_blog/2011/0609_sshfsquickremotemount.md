# sshfs, quick remote mount

@meta publishDatetime 2011-06-09T09:00:00.000+02:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2011/06/sshfs-quick-remote-mount.html

When all you have is ssh access to a machine you have enough to mount a remote disk to your work station. How? easy:

```c++
sshfs user@host:/path/to/remote/dir /path/to/local/dir
```

Remember you need permission for both local and remote directories.

# Comments

---
## In reply to this post, [Anonymous]() commented @ 2011-06-10T13:56:11.000+02:00:

Awesome tip!! Never knew about this, but it'll be an amazing time saver!

Original [published here](md_blog/2011/0609_sshfsquickremotemount.md).

---
## In reply to this post, [Links 10/6/2011: $35 Linux Tablet, Free Software Foundation Backs LibreOffice | Techrights](http://techrights.org/2011/06/10/fsf-backs-libreoffice/) commented @ 2011-06-10T19:06:28.000+02:00:

[...] sshfs, quick remote mount [...]

Original [published here](md_blog/2011/0609_sshfsquickremotemount.md).

---
## In reply to this post, [twitter](http://slashdot.org/~twitter/journal/217907) commented @ 2011-06-10T21:59:01.000+02:00:

That's a nice tip, thanks.

I like the sftp kio slave with Konqueror. Typing "sftp://user@hostname/path" will open path for file browsing. The address can be bookmarked like any other url and the same scheme works for any KDE file open dialog. Files browsed in Konqueror drag and drop seamlessly between the remote computer and local or other remote computers and behave in every other way like a local file. sshfs will generalize this behavior to other file browsers and applications.

Original [published here](md_blog/2011/0609_sshfsquickremotemount.md).

---
## In reply to this post, [Nico](md_blog/youfoundadeadlink.md) commented @ 2011-06-19T13:53:04.000+02:00:

Nice tip twitter, thanks

Original [published here](md_blog/2011/0609_sshfsquickremotemount.md).
