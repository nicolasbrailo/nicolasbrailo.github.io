# Just WTF

@meta publishDatetime 2010-06-08T09:00:00.000+02:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2010/06/just-wtf.html

Who the hell can create a monster like this one?

```sql
CREATE PROC shutdown10
AS
EXEC xp_cmdshell 'net send /domain:SQL_USERS ''SQL Server
shutting down in 10 minutes. No more connections
allowed.', no_output
EXEC xp_cmdshell 'net pause sqlserver'
WAITFOR DELAY '00:05:00'
EXEC xp_cmdshell 'net send /domain: SQL_USERS ''SQL Server
shutting down in 5 minutes.', no_output
WAITFOR DELAY '00:04:00'
EXEC xp_cmdshell 'net send /domain:SQL_USERS ''SQL Server
shutting down in 1 minute. Log off now.', no_output
WAITFOR DELAY '00:01:00'
EXEC xp_cmdshell 'net stop sqlserver', no_output
```

