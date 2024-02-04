# Quickly sharing files in Linux via HTTP

@meta publishDatetime 2016-05-12T09:00:00.000+02:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2016/05/quickly-sharing-files-in-linux-via-http.html

Isn't it awful when you have to share a file too big for email and don't know how? You'd think by 2016 we'd have that figured out. Actually we do, many times over. Just pick a standard that works for you!

If you don't want to read many pages on file transfer standards (Samba? What's that?) you can try this little snippet:

```c++
python -m SimpleHTTPServer $PORT
```

This will create an http server sharing the current directory. HTTP, luckily, is one of those things that tend to work everywhere, always.

Bonus: some other ways of doing the same thing at <https://gist.github.com/willurd/5720255>

