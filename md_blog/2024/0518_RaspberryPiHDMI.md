# Raspberry Pi: HDMI debugging

@meta publishDate 2024-05-18
@meta author Nico Brailovsky
@meta tags Raspberry Pi, Linux, Embedded, IoT

If a Raspberry Pi boots but has no HDMI signal:

* Add `hdmi_force_hotplug=1` to /boot/firmware/config.txt - this forces the Pi to send HDMI video even if it thinks there's no monitor connected.
* Add `config_hdmi_boost=4` to /boot/firmware/config.txt - this tweaks the HDMI signal strength.

Also, remove all possible adapters (each will add a bit of noise and attenuation) and get a cable with good shielding.

Source <https://elinux.org/R-Pi_Troubleshooting#No_HDMI_output_at_all>

Extra tip: Unlike their bigger brothers, Raspberry Pi Zeros don't seem to want to boot up with no SD card in, not even to show a bootloader error.


