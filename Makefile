.PHONY: local_server clean gen publish

local_server:
	python3 -m http.server

clean:
	rm -rf blog
	make -C MdlogGen clean

gen:
	python3 ./MdlogGen/gen.py ./gen_config.json

publish: gen
	git add blog* md_blog*
	git commit -am 'Publish post' && git push

favicon.ico:
	wget https://openverse.org/image/b7a1247d-e959-4e46-a881-8b905627cae2?q=monkey
