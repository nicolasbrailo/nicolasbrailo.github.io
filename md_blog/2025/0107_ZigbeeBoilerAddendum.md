# Zigbee Boiler: bugfix addendum

@meta publishDate 2025-01-07
@meta author Nico Brailovsky
@meta tags Zigbee, IoT

I came back from holidays with a mystery to solve: my [automated heating system](md_blog/2024/0506_ZigbeeBoiler.md) kept, for hours, trying to shut down heating. Why wasn't it turning off?

After a few weeks, once home (because my home automation has no inbound internet access, only message publishing to Telegram) the puzzle got more interesting: the logs said it was trying to shut heating down, however its state was never "on" in the first place. To top it off, the temp charts showed this: Crazy high spikes, as high as 25 degrees. Why did the system think it was off while the boiler was running?

[![](/blog_img/250107temp.jpg)](/blog_img/250107temp.jpg)

I tried a few lines of investigation. Sometimes sensors misreport data, saying a room is 0, or Nan, or 50 degrees (C!), or some other unreasonable value, however those are filtered out. Maybe a bit flipped and the Zigbee name/alias is different, but no, I could control the boiler normally if I manually turned it on when it was off. It was like something else was controlling the device... and then I re-read [my own article](md_blog/2024/0506_ZigbeeBoiler.md).

Turns out I never disconnected the original RF controller, I only added a new parallel one. I figured it'd be useful, should my Zigbee controller ever fail! Turns out I chucked the original RF control in a drawer, in a cold corner of my house where I have the heating off. In a cold week, the room where the controller was never reached the minimum temperature to turn the heating off, despite my careful network of sensors shouting "it's hot in here, turn it off".

Fun fact: I bought current sensor to detect when the boiler is on, but it doesn't match the Zigbee state. It was sitting in a drawer, next to the original RF controller. This would make a great fail of the week, too bad the Embedded Muse is no longer running.

I'm not looking forward to the gas bill next month, but at least my cats got to enjoy a balmy 24C winter break for a few weeks.

