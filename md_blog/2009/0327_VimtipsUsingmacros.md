# Vim tips: Using macros

@meta publishDatetime 2009-03-27T18:13:00.001+01:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2009/03/vim-tips-using-macros.html

Clik-click tap, clik-click tap, clik-click tap. A team mate is performing some kind of repetitive operation with text and it's becoming more and more annoying. Good news, there's a way to keep your mental sanity and help this guy to be more productive: replace him with a sed/awk script teach him how to use Vim macros!

Vim macros can repeat for you a sequence of commands. Press ***q******q*** to start recording, then"***q*** again to stop. Use ***@q*** to execute a macro. Let's try it:

>
> This - random garbage
> is - random garbage
> a - random garbage
> sample - random garbage
> text - random garbage
>
>
>

So, how would you get rid of the random garbage? Move the cursor to the beggining of the first line, press ***qq*** to start recording then ***f-*** to move the cursor to the dash and ***d$*** to delete the rest of the line. Now move the cursor to the begging of the next line (***0j***) and press ***q*** to stop recording. Now press ***4@q*** to repeat the macro for times and check the results; you should have something like this:

>
> This
> is
> a
> sample
> text
>
>
>

Neat, huh? You can also store any number of macros using a different letter after the ***q*** to start recording, for example ***qn*** to record and ***@n*** to execute. Also, use ***@@*** to execute once again the last executed macro (from any buffer).

There are some more things you can do with macros (like editing before executing one) but the best source for that is the manual.

