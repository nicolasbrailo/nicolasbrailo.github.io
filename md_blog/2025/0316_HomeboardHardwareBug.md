# Homeboard: A Hardware bug!

@meta publishDate 2025-03-16
@meta author Nico Brailovsky
@meta tags IoT, Homeboard

I found my first hardware bug! Can you spot it? It's the big red circle:

[![](/blog_img/2025/0316_HomeboardHardwareBug1.jpg)](/blog_img/2025/0316_HomeboardHardwareBug1.jpg)

The mmwave sensor was mounted too close to either the screen, or the power source (something I thought was a brilliant idea yesterday). Turns out that mounting it so close has an affect on this sensor: when the display is on, it blocks the sensor (and reads it as no-presence). When the display is off, for some reason the sensor picks it up as someone being present. This is bad, because on presence I turn the display on, and on vacancy off. I guess my living room put on a light show for my cats last night.

I suspect I could fix this in the firmware of the sensor, but that's pointless because [I can't reverse engineer the sensor protocol anyway](md_blog/2024/0615_LD2410SmmWaveSensor.md). What's the next best fix?

[![](/blog_img/2025/0316_HomeboardHardwareBug2.jpg)](/blog_img/2025/0316_HomeboardHardwareBug2.jpg)

I moved the sensor out of the way, while I think of a better placement.

