# Redshift: Cool your monitor

@meta publishDatetime 2010-09-21T09:00:00.000+02:00
@meta author Nico Brailovsky
@meta originalUrl https://monkeywritescode.blogspot.com/2010/09/redshift-cool-your-monitor.html

I've been trying [Redshift](http://jonls.dk/redshift/) the last few days. It's a really cool (pun intended) and simple program. It just sits there all day long, doing nothing. Yeap, it's just one more pointless thing on your ps -ef list, up until noon, when it comes to life: it will adjust your monitor's temperature, gradually, from a cool color to a warmer color.

### Say what?

I know what you are thinking. "Why the hell did I eat so much cake?". And probably something like "WTF? Monitor temperature? Mine is running cool, k thx bye" too. The monitor temperature (color temperature, to be more accurate) is the percieved temperature of an object emiting light at the specific wavelength of that color:

![](/blog_img/colour-temperature.gif)
So, a blueish color means a higher temperature, and it's the natural ambience light color you see during the day. Towards the night the color temperature begins too cool down towards a more orange color. This is the temperature Redshift changes.

### So what?

Fair question. After a couple million years our brains got used to seeing a hot color temperature during the day (do I have any reader that old?) so staring at a blue monitor all day will keep you awake all night long, the theory being that switching its temperature towards a reder color will help you sleep at night.

### Does it work?

Probably not, but that doesn't make it any less cool (pun not intended). I think if you fine-tune this app to your sleeping hours it may be of some use, because otherwise you'll get a very dark screen at 5pm (don't you people know the timezone in Argentina is [FOOBAR'd](https://bugs.launchpad.net/ubuntu/+source/tzdata/+bug/278419)).

