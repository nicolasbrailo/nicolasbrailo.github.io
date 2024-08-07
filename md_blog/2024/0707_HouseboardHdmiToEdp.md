# Houseboard P0: HDMI to eDP

@meta publishDate 2024-07-07
@meta author Nico Brailovsky
@meta tags IoT, RaspberryPi, Homeboard

Minor victory in my quest to build a houseboard based on a Linux-PoE-netboot-RaspberryPi-etc: I figured out how to run my own LCD panel.

[![](/blog_img/0707_HouseboardHdmiToEdp/1DPtoeDP.jpg)](/blog_img/0707_HouseboardHdmiToEdp/1DPtoeDP.jpg)

The first step was verifying my panel worked. For this, I used a display port to eDP converter. Turns out eDP is basically DP, but over a ribbon cable. There are some cheap boards, [for example](https://www.aliexpress.com/item/1005006914739674.html), that do this - searching for "DP to eDP" or "display port to eDP" will yield a high number of vendors. The key part is matching the ribbon type of the panel you need to drive (30 or 40 pins).

Unfortunatelly, single-board-computers (like the RaspberryPi) don't have DP, despite DP being better than HDMI in every way. The cost of adding a DP connector seems to be high and mosty in licenses, not necessarily in components, so SBCs don't do it. This meant that getting my expensive GPU to use my cheap panel wasn't good for much beyond knowing the panel works.

Fortunatelly, I managed to find a board that liked my panel:

[![](/blog_img/0707_HouseboardHdmiToEdp/2HDMItoeDP.jpg)](/blog_img/0707_HouseboardHdmiToEdp/2HDMItoeDP.jpg)

I got a "[PCB-800807V6-1HDMI-EDP 30PIN LCD driver board](https://www.aliexpress.com/item/32968710965.html)", which comes at about £10 and supports multiple resolutions. This was a nice lucky find, and it unblocked the build of HouseboardP0, which I'll document in some other entry.

