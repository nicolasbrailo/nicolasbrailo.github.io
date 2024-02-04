# GCC instrumentation flag: slow everything down!

@meta publishDatetime 2019-05-08T09:00:00.001+02:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2019/05/gcc-instrumentation-flag-slow_8.html

Here's a nice gcc tip if you think your code is running too fast: instrument everything! (Ok, it may also work if you need to create a profile of your application but for some reason Valgrind isn't your thing).

Compile with

```c++
g++ foo.cpp -ggdb3 -finstrument-functions
```

You can get a list of symbols with nm and c++filt, or you can implement your own elf reader too for extra fun.

```c++
extern "C" {
    bool g__cyg_profile_enabled = false;
    stack g__cyg_times;

    void __cyg_profile_func_enter(void *, void *) __attribute__((no_instrument_function));
    void __cyg_profile_func_exit(void *, void *) __attribute__((no_instrument_function));
    void cyg_profile_enable() __attribute__((no_instrument_function));
    void cyg_profile_disable() __attribute__((no_instrument_function));

    void __cyg_profile_func_enter(void *this_fn, void *call_site) {
        if (not g__cyg_profile_enabled) return;
        cout &lt;&lt; this_fn &lt;&lt; endl;
    }

    void __cyg_profile_func_exit(void *this_fn, void *call_site) {
        if (not g__cyg_profile_enabled) return;
        cout &lt;&lt; this_fn &lt;&lt; endl;
    }

    void cyg_profile_enable() {
        g__cyg_profile_enabled = true;
    }

    void cyg_profile_disable() {
        g__cyg_profile_enabled = false;
    }
}

int a() {
    return 42;
}

int b() {
    return a();
}

int c() {
    int x = b();
    int y = a();
    return x+y;
}

int d() {
    return c() + b();
}

int main() {
    cyg_profile_enable();
    cout << d() << endl;
    cyg_profile_disable();
    return 0;
}
```

