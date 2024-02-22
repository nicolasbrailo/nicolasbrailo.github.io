.PHONY: local_server clean

local_server:
	python3 -m http.server

clean:
	rm -rf blog
	make -C mloggen clean

gen:
	python3 ./mloggen/index_gen.py md_blog md_gen
	python3 ./mloggen/html_gen.py blog md_blog md_gen
	cp ./mloggen/site_design/style.css .
	cp ./mloggen/site_design/codehighlight.js .
	cp ./mloggen/site_design/search.js .

