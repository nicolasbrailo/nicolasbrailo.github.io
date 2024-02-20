# Moving away from DB IPC

@meta publishDatetime 2011-03-24T08:00:00.000+01:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2011/03/moving-away-from-db-ipc.html

[Last time](/blog_md/2011/0322_DBIPCCommunicatingprocessesthewrongway.md) I wrote about why DB IPC is bad. Now I intend to write about the way to start moving away from it, towards a better architecture.

As I mentioned, this pattern is deeply rooted across all the enterprise platform, so removing it is not an easy task, and it can only be done in small steps. Small steps means a compromise solution, you won't be going from IPC DB to a restful application in a week, so having an ugly-but-not-so-much-as-ipc-db solution is the way to go.

The first step to move from DB IPC to a services oriented architecture is moving from data driven applications to event driven applications. That means, instead of polling the database for changes, receive a notification that the data has changed and act upon the event.

A way to implement notifications without polling is having the DB notify you of any changes occurred. A way of doing this is using something like otl\_subscriber, a wrapper to Oracle's notifications features. Postgres has its own notification schema, MySQL AFAIK doesn't.

Once you have managed to separate the responsibility of processing the event and the data of the event itself, it's easy to go one step beyond and implement a messaging platform, like CORBA or something like AMQP.

**Conclusion**: the architecture may not be nice with DB notifications either, but you have taken the first step towards decoupling two different components. From this schema to a real queue there's only one step, and once there you can finally begin to have a db-schema for each application.

