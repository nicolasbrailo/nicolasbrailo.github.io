.PHONY: local_server clean

local_server:
	python3 -m http.server

clean:
	rm -rf blog
	make -C MdlogGen clean

rss:
	python3 ./MdlogGen/rss_gen.py 10 md_blog

gen:
	python3 ./MdlogGen/index_gen.py md_blog md_gen
	python3 ./MdlogGen/html_gen.py blog md_blog md_gen
	cp ./MdlogGen/site_design/style.css .
	cp ./MdlogGen/site_design/codehighlight.js .
	cp ./MdlogGen/site_design/search.js .

