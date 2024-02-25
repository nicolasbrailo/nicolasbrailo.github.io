# MdLogGen

@meta author Nico Brailovsky
@meta publishDate 2024-02-25
@meta tags Own projects

If you're reading this, you somehow found me at [nicolasbrailo.github.io](https://nicolasbrailo.github.io/blog). Maybe you came here from [one of my many previous blogs](md_blog/2024/0218_MovedAgain.md), and you're marveling at the beautiful new design (?). As I alluded to in the ["moved again"](md_blog/2024/0218_MovedAgain.md) note, this site is built from a source of md files, [using a custom md-to-html enginge](https://github.com/nicolasbrailo/MdlogGen). If you're sane, you're probably why I would create an md-to-html engine, instead of using one of the many available options.

## MdlogGen: yet another MD site generator

[MdlogGen](https://github.com/nicolasbrailo/MdlogGen) is a simple md-to-static-html, however it supports a few features I wasn't able to find elsewhere: comments, and site-search. MdlogGen depends on Github for these two features (or, rather, depends on the viewer to have a Github account to be able to use these two features).

MdlogGen also supports the exact feature set I need, no more and no less; while using an off-the-shelf generator may have been a better longer term investment, 90% for the raison d'etre of this site is "for fun", and spending a weekend writing hacky code is more fun than spending a weekend trying to figure out how to configure Github deploy rules, and learning to use a third party content generator. I get to write enough code for a living during the week - weekends are for fun code! An alternate reason is that I already had to spend a chunk of time cleaning XML exports from my previous sites to build this one - so MdlogGen is sort of a natural evolution of those scripts. Kind of.

Check out [MdlogGen](https://github.com/nicolasbrailo/MdlogGen)'s reamde: while many other md-to-html generators exist, I think this may be one of the simplest feature-complete generators out there.

