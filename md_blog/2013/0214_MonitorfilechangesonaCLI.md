# Monitor file changes on a CLI

@meta publishDatetime 2013-02-14T08:00:00.000+01:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2013/02/monitor-file-changes-on-cli.html

The other day I had a problem with a config file being overwritten. Some process, I did not know which one, was overwriting a configuration file I manually changed. Annoyed by this, I started looking for the culprit. lsof was no good, because that would list the open files; this process would most likely just open the file, write to it and then close it again. My chances of ever catching this process in the act were nil. Luckily I found auditd. Install it like this:

```bash
sudo apt-get install auditd
```

Then to monitor a file you can use the following command:

```bash
sudo auditctl -w $FILE -p war
```

Wait until $FILE has changed, then execute this command to get the results:

```
ausearch -f $FILE
```

Voila, now you have your culprit. Kill -9 at will.

