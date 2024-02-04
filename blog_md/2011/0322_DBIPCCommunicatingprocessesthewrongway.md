# DB IPC: Communicating processes the wrong way

@meta publishDatetime 2011-03-22T08:00:00.000+01:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2011/03/db-ipc-communicating-processes-wrong-way.html

A common pattern in enterprisy applications is DB IPC, probably one of the worst kind of coupling you can have. If you tell me you never saw it I won't believe you, but in any case: DB IPC is an architecture antipattern, in which you have several semi-independent components which must share some kind of information, and do so through a database. The producer writes into a table, the consumer polls the table for changes.

For an otherwise perfectly designed application, DB IPC may seem like a bad thing but not the worst kind of architecture possible. Clearly a god object may look uglier than an IPC DB. Yet this kind of architecture leads to a tight coupling between the component's inner data structures, making any change in them very unlikely, if not impossible.

Inhouse applications tend to rely a lot on this pattern, albeit unknowingly, for historical reasons: components which are now different applications were once part of a single process, in which no IPC was needed. After these components start growing, instead of a careful and planned change IPC DB gets implemented. It is the path of less resistance, after all.

Steering away from this pattern is very difficult, as it requires a lot of changes to every single application on the enterprise platform, and the introduction of new technologies like CORBA or web services. Seeing this is maintenance job and not productive (i.e. money making) development, it tends to get delayed.

Not everything is lost. An intermediate solution, not as ugly as IPC DB but not so nice as CORBA, is implementing a queue using the DB itself. We'll see a way of doing just that next time.

