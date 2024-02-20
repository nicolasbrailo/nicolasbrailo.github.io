# svn tip: branch stable version, then use externals

@meta publishDatetime 2011-11-24T06:42:00.000+01:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2011/11/svn-tip-branch-stable-version-then-use.html

Even though the title says svn, this tip is applicable probably for any version control system. Imagine the following scenario: You have project BestAppEver. BestAppEver depends on BestLibEver. Both are using svn. How do you handle this on your version control system?

One way, the wrong way, that I have seen lots of times is to just include a copy of BestLibEver inside BestAppEver, like this:

![](/blog_img/svn_externals11.png)

This is horrible, whenever BestLibEver is updated you need to manually update BestAppEver. Thus, we come to the second (but not quite the best) solution: [svn externals](http://svnbook.red-bean.com/en/1.0/ch07s03.html). They work like this:

![](/blog_img/svn_externals21.png)

Again, although I said svn externals, most version control systems have their own externals version. For a detailed explanation on how externals work you should read the link above, for the moment let's just say this is enough to setup the external:

```c++
$ svn pe svn:externals .
# This will open your default editor. Now write this:
LibName           LibURL
```

Now every time you run an svn update, it will fetch the latest version of BestLibEver. We have a problem though: BestLibEver may be a project with a lot of commits, and the head revision may be very unstable. Not only it may crash (being a development version, it wouldn't be a strange thing) but also its interfaces may be constantly changing. And we certainly don't want to spend all day just changing our wrappers to make the project compile again.

There is a solution for this, and we don't have to go back to the first method of just copying the trunk to our repository: we can ask the maintainer of BestLibEver to just create a branch (or a tag, for this case it's pretty much the same) for a stable version and then use an external to that branch. Like this:

![](/blog_img/svn_externals31.png)

Now the team developing BestLibEver can work without complaints from their users and BestAppEver can have a stable svn, with controlled lib upgrades whenever they want.

# Comments

---
## In reply to this post, [Ezequiel]() commented @ 2011-11-29T16:32:06.000+01:00:

An alternative is setting the revision number when defining the external using -r{revision number}

Original [published here](md_blog/2011/1124_svntipbranchstableversionthenuseexternals.md).
