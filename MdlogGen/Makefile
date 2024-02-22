.PHONY: install_deps clean refresh_site_design_3p
install_deps:
	sudo apt-get install python3-markdown

clean:
	rm -f site_design/style.css site_design/codehighlight.js

refresh_site_design_3p: site_design/style.css site_design/codehighlight.js

site_design/style.css: site_design/custom.css
	echo -n "\n\n/* https://unpkg.com/chota@latest */\n" > $@
	wget -O - https://unpkg.com/chota@latest >> $@
	echo -n "\n\n/* https://cdnjs.cloudflare.com/ajax/libs/prism/9000.0.1/themes/prism.min.css */\n" >> $@
	wget -O - https://cdnjs.cloudflare.com/ajax/libs/prism/9000.0.1/themes/prism.min.css >> $@
	echo -n "\n\n/* Custom */\n" >> $@
	cat $^ >> $@

site_design/codehighlight.js:
	echo -n "\n// https://cdnjs.cloudflare.com/ajax/libs/prism/9000.0.1/prism.min.js\n" > $@
	wget -O - https://cdnjs.cloudflare.com/ajax/libs/prism/9000.0.1/prism.min.js >> $@
	
	echo -n "\n// https://cdnjs.cloudflare.com/ajax/libs/prism/9000.0.1/components/prism-bash.min.js\n" >> $@
	wget -O - https://cdnjs.cloudflare.com/ajax/libs/prism/9000.0.1/components/prism-bash.min.js >> $@
	
	echo -n "\n// https://cdnjs.cloudflare.com/ajax/libs/prism/9000.0.1/components/prism-clike.min.js\n" >> $@
	wget -O - https://cdnjs.cloudflare.com/ajax/libs/prism/9000.0.1/components/prism-clike.min.js >> $@
	
	echo -n "\n// https://cdnjs.cloudflare.com/ajax/libs/prism/9000.0.1/components/prism-c.min.js\n" >> $@
	wget -O - https://cdnjs.cloudflare.com/ajax/libs/prism/9000.0.1/components/prism-c.min.js >> $@
	
	echo -n "\n// https://cdnjs.cloudflare.com/ajax/libs/prism/9000.0.1/components/prism-cpp.min.js\n" >> $@
	wget -O - https://cdnjs.cloudflare.com/ajax/libs/prism/9000.0.1/components/prism-cpp.min.js >> $@

