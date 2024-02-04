# Using BoUML as a case tool

@meta publishDatetime 2011-02-17T08:00:00.000+01:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2011/02/using-bouml-as-case-tool.html

I don't really fancy CASE tools a lot, they are mostly fads, but I must admit it, using BoUML to work on a design the other day was a nice surprise. Not only the generated code didn't seem to be written by an trained monkey [1], it almost seemed to be usable with some tweaking. It even generated nice javadocs!

For this article I'll asume you have some experience with [BoUML](https://www.bouml.fr/). If you don't, apt-get it (it's available for Linux and Windows) then come back later, I'll wait.
[BoUML's manual](https://www.bouml.fr/documentation.html) is quite good and includes a lot of screenshots, but if you're already experienced using it you may find this short checklist quicker to create a new project and use the code generation tools:

* Languages > C++ [...]; this will tell BoUML what language should generate. I haven't tried other than C++ but I've heard they work fine.
* Draw some nice UML to create a couple of classes (i.e. create a class view and a class diagram, then add some classes). Don't forget to add some relationships, so the generated code can be something more than "class Foobar{};"
* Create a deployment view. Something like "Foobar\_deploy"
* Edit the class view, it should open a class view dialog. Select your new deployment view
* Right click on each class and click "Create source artifact". This'll create a new artifact under your deployment view
* Almost done. In project > Edit > Edit Generation Settings go to "Directory" tab and select a root directory
* You're now ready to right click on your class view and select "Generate > C++". Congratulations.

Generating namespaces in C++ wasn't easy at first, and the manual may not be so clear about this one:
* Create a package. Move everything there (your deployment view, class view, etc).
* Edit the package. Under C++ complete each path and namespace name (?). For example, Foo, Foo Foo would generate your sources and headers under ./Foo, with namespace Foo.
* Repeat for as many namespaces as you want. You can have nested namespaces but you'll have to specify the full path and namespace name, i.e. Foo/Bar, Foo/Bar\_CPP, Foo::Bar

If you're going to use BoUML as a case tool, you'll want to name associations, use the multiplicity, create setters and getters and all the stuff you probably never did when documenting in UML to reach a [minimum user-documentation wheight](http://thedailywtf.com/Articles/Very,_Very_Well_Documented.aspx). It seems these CASE tools haven't developed telepathy yet. Too bad.

Source: [$ man BoUML](https://www.bouml.fr/doc/package.html)
[1] Regardless of the fact that some may say that about my own code.

