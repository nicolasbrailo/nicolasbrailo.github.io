# No cloud IoT: LAN only Security camera

@meta publishDate 2024-05-23
@meta author Nico Brailovsky
@meta tags IoT

A while back I spent some time setting up a security camera/doorbell. I wanted to have a camera that

* Requires no external vendor connection: I must be able to run it locally, forever, with or without Internet.
* I can monitor on real time, ideally with my phone.
* notifies me when the doorbell button is pressed (integrating with the Sonos speakers throughout my home).
* triggers an event when motion is detected, so I can integrate it with other systems.
* stores videos on a disk when there is motion, so I can review them later.
* will send me a message when I'm out of home and motion is detected.

The process required a lot of trial and error, guessing arcane commands from poor documentation or from random (often decade-old, unmaintained) open source projects. I figured I should document my setup.

## tl;dr

This article ended up being a lot longer than I expected, so if you're here for the short version:

* Reolink makes cameras that are easy to integrate with and require no cloud
* Here's an [example of how to subscribe and process camera events](https://github.com/nicolasbrailo/reolink_aio/tree/ec2469fe45bb4f050900a7bb8d23f51c2bbd6da2/examples/reolink_onvif_subscription), like motion detection or doorbell presses.

* Any sane camera will stream over RTSP. Once you find the RTSP URL, you can test it with ffmepg: `
ffmpeg -i $rtsp_url, -c:v copy -c:a copy $outpath`

* I built a [hacky galery for stored RTSP streams](https://github.com/nicolasbrailo/zigbee2mqtt2web/blob/master/zigbee2mqtt2web_extras/reolink_cam/nvrish.py).

* And also send [copies of the video over Telegram](https://github.com/nicolasbrailo/PyTelegramBot)


## Sourcing a camera

I went for Reolink. After a lot of reading (and a few months of usage, now) it's a very good option in its price range (cheap). They seem to have a good range of cameras, and all the features I was looking for: LAN-first, streaming, motion events, power-over-ethernet and a decent enough admin interface. Besides a very good range of PTZ (pan-tilt-zoom) cams, they also have a PoE a doorbell, which closed the deal for me.

PoE, again: Can't recommend PoE enough: there's no Wifi fighting, and if things get wonky you just ask the switch to cycle the port. You probably already need to run a cable for power, so why not do it for eth instead, and get both in one?

I would love a camera with open source firmware, but I figured if I spent my time tinkering with cam firmware, I would have never actually got the time to integrate it with my IoT network - so maybe a project for the far off future, when I have finished absolutely everything else on my ToDo list. As it is, I decided it's an acceptable trade-off to have an untrusted closed-source firmware running in my network, placed in an isolated vlan without internet access (it's not the only untrusted device I run in my network, and I admit not all of them live in vlans...)

## Talking to the camera

There is a protocol called "[ONVIF](https://en.wikipedia.org/wiki/ONVIF)". Wikipedia claims it hails from the dark ages of the late 2000's, and it has an XML based transport to prove it. ONVIF is meant to be a standard way to discover how an IP camera works, but, like most XML-based protocols turned out to be in practice, is extremely verbose, requires you to traverse countless schema definition files to understand it, and it's quite hard to parse. Of course most cameras I've seen seem to implement ONVIF either partially or with non-standard extensions, making the whole design idea around the XML schema quite pointless anyway.

Reolink cams also support an HTTP/Json REST-like API, which makes things a lot easier. The HTTP interface is simple to inspect and understand by looking at the admin page with a browser's dev tools. Unfortunately, not everything is exposed through their HTTP API, so a bit of ONVIF digging may be necessary. Most notably, in the version of the firmware I tried, it's not possible to configure the camera to talk back to a server when events happen - which is quite important if you intend to use it as a doorbell.

There is an [open source project that translates most of the Reolink HTTP commands to python](https://github.com/nicolasbrailo/reolink_aio). This project makes it very easy to replicate the functionality of the admin interface, but with a Python API. This project should cover 99% of all basic usage. Using this project, you can do things like `cam.doorbell_led` to set up the LED state. Most importantly, [it will take care of the login flow for you](https://github.com/nicolasbrailo/zigbee2mqtt2web/blob/master/zigbee2mqtt2web_extras/reolink_cam/__init__.py#L77), which is quite tedious to implement using raw requests.

## Getting the camera to talk back to us

Note [the project I linked above is actually a fork](https://github.com/nicolasbrailo/reolink_aio). The original project exists pretty much solely to integrate with HomeAssistant, and it's not too ~~user~~developer-friendly if what you're looking for is a way to configure a camera to talk back to a server. Since my most important goal was to use a camera as a doorbell, the first requirement was getting some sort of notification when the doorbell button is pressed.

Reolink cams can announce events back to a URL ([as simple as `cam.subscribe(webhook_url)`](https://github.com/nicolasbrailo/zigbee2mqtt2web/blob/master/zigbee2mqtt2web_extras/reolink_cam/__init__.py#L92C11-L92C37)), but they will do so in an ONVIF format. There is a standalone example of how to [subscribe to ONVIF notifications, and how to parse them, over here](https://github.com/nicolasbrailo/reolink_aio/tree/ec2469fe45bb4f050900a7bb8d23f51c2bbd6da2/examples/reolink_onvif_subscription).

In the example above, there is a Flask server printing a Json version of the ONVIF message. For Reolink cams, it prints the state of the camera (either motion detected, or doorbell button pressed) in a human-friendly Json format. I found the latency to be less than a second for the doorbell press event. The motion detection events, and the AI people detection events, also seem to trigger with low latency, but you'll need to tweak the config to suite your environment; if there is lots of movement in your street, it can be quite noisy.

## Streaming

Streaming is easy! Reolink has an [RTSP](https://en.wikipedia.org/wiki/Real-Time_Streaming_Protocol) link. RTSP is an UDP based protocol that will transport media from a streaming device to another (and you likely use it every day, whenever you make a VoIP call). It's also lightweight, relatively sane, and comes to us from the late 90's (I wonder what happened between the 90's and 10's that gave us XML based protocols).

The RTSP link will be something like `rtsp://$user:$pass@$cam_ip:554/h264Preview_01_main`, but it's [easier to ask the camera](https://github.com/nicolasbrailo/zigbee2mqtt2web/blob/master/zigbee2mqtt2web_extras/reolink_cam/__init__.py#L92C11-L92C37). There are different stream URLs, depending on the camera model, supported codecs, etc, so a little bit of trial and error may be required.

To test an RTSP URL, [VLC](https://www.videolan.org/) is 80% likely to work. I found it, however, quite hard to debug failures using VLC. There may be codec mismatches, missing libraries, connection failures, or other random problems - and VLC it would just say "nope". This is usually good enough for most users, there is not too much a "normal" user can do on an RTSP setup failure. We are, however, not normal, so we use [ffmpeg](https://ffmpeg.org/):

```
ffmpeg -i $rtsp_url, -c:v copy -c:a copy $outpath
```

This magic ffmpeg incantation will connecto to an RTSP URL and copy the incoming audio and video streams to a file, without any re-encoding (by default ffmpeg will try to reencode and spend tons of cpu on it). If everything goes fine, you'll end up with an mpeg of your camera. If it doesn't, ffmpeg will usually print a developer friendly (ish) error message.

Of course once we found a working RTSP URL we wouldn't want to use ffmpeg just to check who's at the door. For that, I found [Ojo works amazingly well](https://github.com/penguin86/ojo). It's an RTSP viewer for Android, available in [F-Droid and probably other app stores](https://f-droid.org/is/packages/it.danieleverducci.ojo/).

## NVR-like service

If you can see an RTSP stream, you can also save to disk. In fact that's exactly what we did to test it, with ffmpeg. [My custom Reolink integration](https://github.com/nicolasbrailo/zigbee2mqtt2web/blob/master/zigbee2mqtt2web_extras/reolink_cam/ffmpeg_helper.py) has an ffmpeg helper; whenever motion is reported by the camera, it will save a copy of the RTSP stream to disk. This means:

* we rely on the camera to report movement, so there can be false positives, and false negatives. You'll need to figure out how well the camera motion detection algorithms work for you.
* by only recording when the camera reports movement, we save a ton of disk space and CPU: no need to record when 99% of the day there is no motion. I like keeping my electricity bill down.
* but we miss the first few seconds of movement. By the time the camera triggers a motion alert, the RTSP is set up, and we start recording, it's likely that more than a few seconds have passed.

I don't know if this is how real NVR services behave: my IoT network is built for fun, and since I have fun coding, I don't always spend a lot of time looking into already-built services. I didn't immediately find an open source NVR-like service that worked as I wanted, so I quickly hacked one based on ffmpeg and some [hacky Flask to create a gallery for the stored videos](https://github.com/nicolasbrailo/zigbee2mqtt2web/blob/master/zigbee2mqtt2web_extras/reolink_cam/nvrish.py).

## Telegram integration

By now, I had a camera integrated into a system that 

* I can monitor on real time, using RTSP
* notifies me when the doorbell button is pressed
* triggers an event when motion is detected
* stores videos on a disk when there is motion

I was only missing IM notifications. I used [Telegram for this, with a custom built integration](https://github.com/nicolasbrailo/PyTelegramBot). The [notifications will trigger](https://github.com/nicolasbrailo/BatiCasa/blob/main/notifications.py#L140) first when motion is detected, and it will send a still frame of the camera stream. Once the motion stops, it will reencode the video in a format that Telegram likes, and send it over too:

```
ffmpeg -i $fpath -vf scale=640:360 -c:v libx264 -crf 23 -preset veryfast -c:a copy $out_path
```

Unfortunately this integration seems to trigger some spam control in Telegram, and got my account banned. I recommend sending pictures only, that seems to be more acceptable to Telegram's term of service.

