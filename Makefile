.PHONY: local_server clean gen

local_server:
	python3 -m http.server

clean:
	rm -rf blog
	make -C MdlogGen clean

gen:
	python3 ./MdlogGen/index_gen.py md_blog md_gen
	python3 ./MdlogGen/html_gen.py blog md_blog md_gen
	python3 ./MdlogGen/html_gen.py . ./index.md
	python3 ./MdlogGen/rss_gen.py 10 md_blog blog \
			"https://nicolasbrailo.github.io/" \
			"Nico Brailovsky's ideas repository" \
			"I write things. A few make sense."
	cp ./MdlogGen/site_design/style.css .
	cp ./MdlogGen/site_design/codehighlight.js .
	cp ./MdlogGen/site_design/search.js .

favicon.ico:
	wget https://openverse.org/image/b7a1247d-e959-4e46-a881-8b905627cae2?q=monkey
