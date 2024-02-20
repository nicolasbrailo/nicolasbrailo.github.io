# To log or not to log

@meta publishDatetime 2010-09-30T09:00:00.000+02:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2010/09/to-log-or-not-to-log.html

Logging is nice, we all know that. It saves you from having to stay up all night checking when and why your applications fails. It servers to blame the support guys for not reading it. It's useful to stress test your RAID.

But logging where you shouldn't is a pain in the ass waiting to happen.

When designing an application you should choose between domain level objects, wiring objects, library level objects, helper objects, etc. Your logging should be mostly in the wiring of your applications, not in the helper objects and very rarely in the domain level objects. These objects, when well designed, are supposed to be tested and to be run in a production environment with many different loggers. If you log in the middle of your business object you may end up writing logs through cout when you're testing, or worse, when you're supposed to be logging in syslog.

