# Cofeeeeeee

@meta publishDatetime 2010-03-18T11:00:00.000+01:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2010/03/cofeeeeeee.html

```c++

int main() {
	otl_connect db;
	otl_connect::otl_initialize();
	db.rlogon("whatever");

	int cuarentaydos;
	const char *sql = "select 42 drom dual";
	otl_stream stmt(1, sql, db);

	if (!stmt.eof()) stmt &gt;&gt; cuarentaydos;
	std::cout &lt;&lt; "En la base 42 == " &lt;&lt; cuarentaydos &lt;&lt; "n";
	db.logoff();
}

```

I spent half an hour looking for the error. How come drom is not a standard sql keyword? Damn!

