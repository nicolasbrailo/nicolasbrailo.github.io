# Template metaprogramming XI: Hidden Agenda

@meta publishDatetime 2010-07-20T09:00:00.000+02:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2010/07/template-metaprogramming-xi-hidden.html

Wow, number eleven already. We're getting more chapters here than Final Fantasy games. I didn't even imagine there was so much to write about such an esoteric language features like templates. I do wonder if anyone will actually read it, but that's a completely different problem.

Enough meta-meta talk: what can we do with all the things we have learned? We can calculate pi and e, we already showed that as an example on one of the first chapters. This chapter I'm going to write about what motivated me to explore the bizarre underworld of template metaprogramming. Some time ago I had to [work with a Berkeley DB](/search?q=Berkeley) researching the feasibility of developing a magic cache for (real) DB table. Leaving aside the discussion of whether this is a good idea (the project did have a good reason to be researched) I hit a major roadblock when trying to provide a façade for every table; something like this:

![](/blog_img/virtualtemplate.png)
See the problem? To do something like that we'd need a [virtual template method](/blog_md/2009/0803_CMagiccallbackssolved.md), and you can't have that. After seeing that I thought to myself "Hey, I'll use templates!". Then I had two problems, but the damage was done, I couldn't go back. What kind of contorted device could we implement to make such a devious requirement work? I'll leave you to think it, the answers I came up with next week.

