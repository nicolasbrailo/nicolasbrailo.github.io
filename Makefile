.PHONY: install_deps local_server clean
install_deps:
	sudo apt-get install python3-markdown

local_server:
	python3 -m http.server

clean:
	rm -rf blog
	rm -f codehighlight.js style.css

gen:
	python3 ./genscripts/index_gen.py md_blog md_gen
	python3 ./genscripts/html_gen.py blog md_blog md_gen

style.css: genscripts/custom.css
	echo -n "\n\n/* https://unpkg.com/chota@latest */\n" > style.css
	wget -O - https://unpkg.com/chota@latest >> style.css
	echo -n "\n\n/* https://cdnjs.cloudflare.com/ajax/libs/prism/9000.0.1/themes/prism.min.css */\n" >> style.css
	wget -O - https://cdnjs.cloudflare.com/ajax/libs/prism/9000.0.1/themes/prism.min.css >> style.css
	echo -n "\n\n/* Custom */\n" >> style.css
	cat genscripts/custom.css >> style.css

codehighlight.js:
	echo -n "\n// https://cdnjs.cloudflare.com/ajax/libs/prism/9000.0.1/prism.min.js\n" > codehighlight.js
	wget -O - https://cdnjs.cloudflare.com/ajax/libs/prism/9000.0.1/prism.min.js >> codehighlight.js
	
	echo -n "\n// https://cdnjs.cloudflare.com/ajax/libs/prism/9000.0.1/components/prism-bash.min.js\n" >> codehighlight.js
	wget -O - https://cdnjs.cloudflare.com/ajax/libs/prism/9000.0.1/components/prism-bash.min.js >> codehighlight.js
	
	echo -n "\n// https://cdnjs.cloudflare.com/ajax/libs/prism/9000.0.1/components/prism-clike.min.js\n" >> codehighlight.js
	wget -O - https://cdnjs.cloudflare.com/ajax/libs/prism/9000.0.1/components/prism-clike.min.js >> codehighlight.js
	
	echo -n "\n// https://cdnjs.cloudflare.com/ajax/libs/prism/9000.0.1/components/prism-c.min.js\n" >> codehighlight.js
	wget -O - https://cdnjs.cloudflare.com/ajax/libs/prism/9000.0.1/components/prism-c.min.js >> codehighlight.js
	
	echo -n "\n// https://cdnjs.cloudflare.com/ajax/libs/prism/9000.0.1/components/prism-cpp.min.js\n" >> codehighlight.js
	wget -O - https://cdnjs.cloudflare.com/ajax/libs/prism/9000.0.1/components/prism-cpp.min.js >> codehighlight.js

