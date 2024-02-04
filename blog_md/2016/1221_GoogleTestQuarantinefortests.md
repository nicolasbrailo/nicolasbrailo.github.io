# Google Test: Quarantine for tests?

@meta publishDatetime 2016-12-21T08:00:00.000+01:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2016/12/google-test-quarantine-for-tests.html

Google Test: Putting a test under quarantine

GTest works wonders for c++ testing, even more so when combined with GMock. I've been using these frameworks for a few side projects. I've seen them used in large scale projects too. In all cases, there is a very common problem for which (I think) there is no elegant solution: managing temporarily disabled tests.

It may be because you found a flaky piece of code or a test that exposes a heisenbug. Maybe the test itself is just unstable, or perhaps you are using TDD and want to submit a test to your CI before its implementation is ready. In these cases, you can choose to disable the offending test or let it run, possible halting your CI because of it. When that happens, you maybe masking other, real, problems.

Most people would stick a "DISABLED\_" before the test name, to let GTest know not to run it. Maybe even stick a "// TODO: reenable" in there too. When run, GTest will generate a message to let you know there is a disabled test. Even so, I find that people -myself included- tend to forget to re-enable the disabled tests.

For one of my side projects, I hacked GTest to quarantine tests up to a certain date:

```c++
TEST(Foo, Bar) {
    QUARANTINE_UNTIL("16/8/22");
    EXPECT_EQ(1,2);
}
```

In my CI setup, that test will be showing a happy green (and a warning, which I will probably ignore) until the 22nd of August. By the 23rd the test will run again and fail if I haven't fixed the code. If I have indeed fixed it, it will print a warning to remind me that it's safe to delete the quarantine statement.

Is there any advantage in this approach over the usual \_DISABLE strategy? In my opinion, there is: if you ignore warnings in your test, for whatever reason, a \_DISABLE might go unnoticed and it may hide a real problem. In the same scenario, for a quarantined test, nothing bad happens: the warning just says "you should delete this line" but the quarantined test is again part of your safety net.

How does it work? The first caveat in my article mentions it: hackishly. There are a few facilities missing in GTest to make this implementation production-ready but, ugly as it looks, it should work as intended:

```c++
#include &lt;ctime&gt;
#include &lt;string&gt;
#include &lt;sstream&gt;
std::string now() {
    time_t t = time(0);
    struct tm *now = localtime(&amp;t);

    std::stringstream formatted_date;
    formatted_date &lt;&lt; (now-&gt;tm_year+1900) &lt;&lt; &#x27;/&#x27;
                   &lt;&lt; (now-&gt;tm_mon+1) &lt;&lt; &#x27;/&#x27;
                   &lt;&lt; now-&gt;tm_mday;

    return formatted_date.str();
}

#define QUARANTINE_UNTIL(date_limit)                                     \
        if (now() &lt; date_limit) {                                        \
            GTEST_LOG_(WARNING) &lt;&lt; "Test under quarantine!";             \
            return;                                                      \
        } else {                                                         \
            GTEST_LOG_(WARNING) &lt;&lt; "Quarantine expired on " date_limit;  \
        }

```

If I find there is interest in this approach for real world applications, I may try to come up with a nicer interface for it.

