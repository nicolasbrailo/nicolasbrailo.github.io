# Non standard UML: decomposing inheritance in sequence diagrams

@meta publishDatetime 2012-12-20T08:00:00.000+01:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2012/12/non-standard-uml-decomposing.html

TL;DR: In sequence diagrams, separating an object into (some of) its parent classes improves readibility, at the cost of a not so accurate structure description.

A sequence diagram is supposed to display interactions between objects, making enphasis on its sequentiality. The important part here is "between objects"; as far as I know, the standard states that you should display interaction between entities, or the interaction of an entity with itself through a public interface.

Usually this works just fine, since a sequence diagram provides a way of understanding a program through the interaction of its entities, however I found that sometimes you need to express the interaction of an object with his own public interface with a little bit more of detail, namely when there's inheritance involved.

When there's an extension relationship between two objects, and a dependency (i.e. a call) in methods of this two classes, the code for each method usually "lives" far appart, most usually in two different files. Portraying these two methods as a reflexive call is sintactically accurate for a sequence diagram, but I found it very poor semantically. Representing this dependency as a call between two different objects might not be a sintactically correct representation, as you are treating a single entity as two different objects, but I have found it results in much clearer and cleaner diagrams.

Of course spliting an entity into multiple objects has the disadvantage of inducing the reader to believe these are indeed different objects, but since the purpose of a sequence diagram is not to display a static structure I believe this is an acceptable tradeoff, one that can be diminished by just using a note and a reference to a class diagram, where the accurate structure of the classes can be displayed.

