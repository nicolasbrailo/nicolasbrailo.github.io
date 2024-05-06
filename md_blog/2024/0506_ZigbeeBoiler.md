# Zigbee Boiler

@meta publishDate 2024-05-06
@meta author Nico Brailovsky
@meta tags Zigbee, Automation

Weekend project: made my boiler Zigbee compatible, bypassing a Drayton heating thermostat. I'm quite proud of the final results:

[![](/blog_img/zigbeeboiler01.jpg)](/blog_img/zigbeeboiler01.jpg)

On the left, the wiring; on the right, the control panel. **Disclaimer: this note shows an experiment. Don't take any electrical advise from this text.**

For a few years, I've been using <a href="https://github.com/nicolasbrailo/zigbee2mqtt2web">my own home automation system</a>, developed almost from scratch. I should write about it some day (tl;dr, it was a fun weekend project that turned into multiple, mostly fun, weekend projects). Something missing from my home automation was heating integration, which is especially sad given I have Zigbee temperature sensors everywhere. With the winter over I spent a weekend working on making my boiler Zigbee compatible (wouldn't want an expensive emergency visit in the middle of winter to repair my winter).

My boiler uses a Drayton thermostat as a control, which seems very common in the UK (n=3). They seem mostly used as an on/off switch (OpenTherm isn't very common here), so there's no reason I couldn't bypass it with a relay while keeping the normal thermostat as a backup. Both the installation manual and the back of my control unit confirm this:

[![](/blog_img/zigbeeboiler02.jpg)](/blog_img/zigbeeboiler02.jpg)

The heating-on signal is just closing the circuit between two terminals. For good measure, I decided to check this with a volt-meter (which, by the way, I strongly recommend against; unlike attaching a probe to a running program with gdb, probing a live circuit can be a shocking experience).

Once I was triple sure the chances of sparks and magic smoke where low, I got a 1 channel Zigbee relay module (220v, dry, 5 amps); if you are reading this guide for inspiration, make sure your switch can handle more power than your fuse. You don't want random electrical equipment acting as a fuse for your fuse. Also look for a "dry" relay, to keep power supply and control circuits separate, and needless to say it should handle 220V. I went for a "MHCOZY Tuya Dry Contact Zigbee Relay Switch Module,1 Channel AC 100-240V" - there are a few like these and they all seem to be the same whitelabel Zigbee element.

[![](/blog_img/zigbeeboiler03.jpg)](/blog_img/zigbeeboiler03.jpg)

A picture of the wiring; the connection needs to be parallel to the existing controller, to keep both working.

The control logic lives in my [monolithic home automation repo](https://github.com/nicolasbrailo/zigbee2mqtt2web/blob/master/zigbee2mqtt2web_extras/heating/rules.py), as a set of configurable Python rules, and while I've only had a few cold days to try them out, they seem to work. Next winter I'll be able to control my thermostat remotely from my [Telegram bot](https://github.com/nicolasbrailo/PyTelegramBot), while I take a holiday to the beach.

