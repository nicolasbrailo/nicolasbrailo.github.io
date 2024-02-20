# Howto: shutdown a TV with HDMI CEC Chromecast

@meta publishDatetime 2019-05-28T11:00:00.001+02:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2019/05/howto-shutdown-tv-with-hdmi-cec_28.html

That's a long title just to say "how to turn off your TV". Only I want to show how to do it even if you lost your remote control.

Chromecast can turn your TV on and off, as long as it supports something called HDMI CEC. Of course the Chromecast itself needs to be powered, i.e. you can't plug it to a USB port in your TV.

The "on" part is easy: you just start casting something ([your pictures, for example](/md_blog/2019/0405_ChromecasticSlideshow.md)) and Chromecast automagically turns your TV on. The off part is a bit harder.

Turning off is, obviously, an implemented feature, as the Google assistant can do it. After some Wireshark sniffing, I couldn't find any URL you can call in a Chromecast to turn off the TV. Some [people invested more time on this than me](https://github.com/balloob/pychromecast/issues/196), so I assume there's just no simple way to directly use a Chromecast for this. Luckily you can use the Google assistant.

I wrote "simple way". The following maybe doesn't quite qualify as "simple", but it's not too time consuming. It's certainly not elegant, but hey (as of the date I'm writing this article) it works.

How to turn a TV off using a Chromecast
---------------------------------------

### Part 1: Set up the Google assistant SDK

There's no easy way to make a Chromecast turn off a TV, so instead we'll interface with a Google assistant, then ask the assistant to do it for us. There's also no easy way to do this with an API, but the assistant's voice recognition is actually quite good. Let's start by installing the SDK:

1. Follow the setup instructions for the [Google Assistant library](https://developers.google.com/assistant/sdk/guides/library/python/embed/setup), with the changes described below.
2. The assistant examples need a microphone present, but we're not going to use it. If you don't have one and you're doing this in a RaspberryPi, just fake one by putting this in ~/.asoundrc:

```c++
pcm.!default {
  type asym
  capture.pcm "mic"
}
pcm.mic {
  type plug
  slave {
    pcm "null"
  }
}
```

3. The same may be needed for a speaker.
4. Continue the setup guide: create a project in the Actions console. Register also a dummy model to download the json credentials.
5. Follow the "Install the SDK and Sample Code" instructions. In May 2019, they work fine in a RaspberryPI 3 with Raspbian.
6. Try running the sample code. googlesamples-assistant-hotword segfaults but googlesamples-assistant-pushtotalk works fine.

### Part 2: Hack the sample to turn off a TV

You should now have the samples from the SDK running. At least those that don't crash. If you have a microphone, you can ask anything you normally ask the Google assistant like... the weather?

The assistant can turn off your TV if you say "Turn off $Chromecast\_Name". But what if you don't like talking to your phone?

I'm sure you expect I'll reveal a nice, clean way to invoke the assistant and make it turn off your Chromecast. Sorry, that would take too long. There is a text interface for the assistant but I wasn't able to have it running in less than 15 minutes, so these are your options:

* Use festival. echo "$Google assistant command" | text2wave -o cmd.wav will generate a command that (often) the assistant can understand. If you don't have such luck:
* Just record yourself. Hackish? Sure, but if all you need is to shut down a TV, that's enough. **Important note**: Record yourself in mono 16KHz. Otherwise the assistant may not understand the wav file. If you run "file command.wav" it should look like this:

```c++
command.wav: RIFF (little-endian) data, WAVE audio, Microsoft PCM, 16 bit, mono 16000 Hz
```

Whatever method you choose, create a wav file with the command you want to execute (i.e. "turn off $Chromecast\_name) and put it in the directory where you installed the Google Assistant SDK.

### Part 3: Throw your remote to the recycling bin!

You're ready now. Goto the directory where you installed the SDK and recorded your voice command, then try this:

```c++
$ source env/bin/activate
$ googlesamples-assistant-pushtotalk --device-model-id $AN_ID_YOU_GOT_FROM_GOOGLE --project-id $YOUR_GOOGLE_PROJECT_ID --once --verbose -i ./command.wav
```

With a bit of luck that should shut down your TV.

Linkdump:

* https://developers.google.com/assistant/sdk/overview
* https://developers.google.com/assistant/sdk/guides/library/python/
* https://developers.google.com/assistant/sdk/guides/library/python/embed/setup

