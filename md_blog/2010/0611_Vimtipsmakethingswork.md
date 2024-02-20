# Vim tips: make things work

@meta publishDatetime 2010-06-11T01:00:00.011+02:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2010/06/vim-tips-make-things-work.html

So, you are an uber console geek, using only vim and the command line to compile all your projects, execute the tests, blah blah blah... if only you could squeeze that microsecond lost whenever you switch from vim to compile you'd be 1e-4 seconds more productive... oh, wait, you can!

Whenever you think you're project is good enough to compile just hit **:make** to be proven wrong. Type **:make test** to run your tests (because you are using TDD, aren't you?) and watch all those red flags fly by.Also, add the following mapping to your ~/.vimrc for an extra happy coding session:

```bash
map <F5> :make
map <F6> :make test
```

