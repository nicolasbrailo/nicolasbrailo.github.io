# Hex dump in C++

@meta publishDatetime 2011-04-07T09:00:00.000+02:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2011/04/hex-dump-in-c.html

If you need to work with low level stuff (say communications protocols, compression algorithms, stuff like that) you'll be needing an hex dump function sooner or later. Alex, from [Alex on Linux](http://www.alexonlinux.com/), has a great [hex dump function](http://www.alexonlinux.com/hex-dump-functions) for Python and C.

I added an =NULL for caption, I don't use it.

```c++
void hex_dump(char *data, int size, char *caption=NULL)
{
	int i; // index in data...
	int j; // index in line...
	char temp[8];
	char buffer[128];
	char *ascii;

	memset(buffer, 0, 128);

	printf("---------&gt; %s &lt;--------- (%d bytes from %p)n", caption, size, data);

	// Printing the ruler...
	printf("        +0          +4          +8          +c            0   4   8   c   n");

	// Hex portion of the line is 8 (the padding) + 3 * 16 = 52 chars long
	// We add another four bytes padding and place the ASCII version...
	ascii = buffer + 58;
	memset(buffer, &#x27; &#x27;, 58 + 16);
	buffer[58 + 16] = &#x27;n&#x27;;
	buffer[58 + 17] = &#x27;&#x27;;
	buffer[0] = &#x27;+&#x27;;
	buffer[1] = &#x27;0&#x27;;
	buffer[2] = &#x27;0&#x27;;
	buffer[3] = &#x27;0&#x27;;
	buffer[4] = &#x27;0&#x27;;
	for (i = 0, j = 0; i &lt; size; i++, j++)
	{
		if (j == 16)
		{
			printf("%s", buffer);
			memset(buffer, &#x27; &#x27;, 58 + 16);

			sprintf(temp, "+%04x", i);
			memcpy(buffer, temp, 5);

			j = 0;
		}

		sprintf(temp, "%02x", 0xff &amp; data[i]);
		memcpy(buffer + 8 + (j * 3), temp, 2);
		if ((data[i] &gt; 31) &amp;&amp; (data[i] &lt; 127))
			ascii[j] = data[i];
		else
			ascii[j] = &#x27;.&#x27;;
	}

	if (j != 0)
		printf("%s", buffer);
}
```

