# Weekend project: Nanny Godmin

@meta publishDate 2026-03-15
@meta author Nico Brailovsky

Another (multi)weekend project: [Nanny Godmin is a service to monitor (and remotely lock) Android devices](https://github.com/nicolasbrailo/NannyGodmin). It's not meant to work against adversarial users, it's meant to limit kids' device usage time, and set the devices' volume.

As much as I'd prefer to let children self-regulate usage, I find that encouragement through some form of monitoring is needed. I also find myself getting lost in my own weekend projects (ahem, this one), which at times leaves me without a reminder that I need to... discourage device utilization. This service is now reminding me, as well as my children, when it's time to put our devices down.

Fun anecdote: I set the usage threshold fairly low, for testing purposes, and forgot about it. Went about my day, and discovered my phone was locked when I tried to use it for a payment. I have, since then, implemented a mechanism to fail open or closed when the service is unreachable (that is, when I'm outside my LAN), but in at least one occasion, I have now locked myself out of my own device.

From the readme:

> NannyGodmin is a parental control/remote management and monitoring Android service. It is designed to run as a persistent foreground service, track user activity, capture screenshots remotely, and allow a remote server to "lock" the device or adjust system settings. It's not meant to be used as an MDM (for starters, there is no attestation), it's meant to be used as a remote control for devices in a known safe security domain (ie only use it in your LAN), with non adversarial users.

> * Lock/unlock all devices, manually, or automatically based on usage thresholds or on a timer

> * Remotely set devices' volume

> * Request devices' screenshots

> * Get a usage report to monitor when the device was active each day, and how long it was used for

> * Get a list of used apps, and for how long they were active

![](https://github.com/nicolasbrailo/NannyGodmin/raw/main/README_screenshot1.png)

Some day I'll extend this with a proper attestation mechanism and true MDM owner mode, mostly because I want to understand how hard it is to build an MDM system. For now, it's a good app to control the volume of devices at home without needing to shout to anyone!

