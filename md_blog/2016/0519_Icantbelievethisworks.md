# I can't believe this works!

@meta publishDatetime 2016-05-19T09:00:00.000+02:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2016/05/i-can-believe-this-works.html

Are you bored? Try pasting this, as is, in a cpp file:

```c++
// What is going on here??/
Is this even legal C++??/
Yes, it is!
```

NB: You may have to use -trigraphs to compile this. Try it out! You can use this command:

```c++
echo -e "// What is going on here??/Is this legal C++?" | g++ -E -c -trigraphs -
```

With some luck, this won't be legal C++ anymore after C++ 17 deprecates trigraphs.

