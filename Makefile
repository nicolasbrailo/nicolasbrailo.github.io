.PHONY: local_server clean gen publish

local_server:
	python3 -m http.server

clean:
	rm -rf blog
	make -C MdlogGen clean

gen:
	python3 ./MdlogGen/gen.py ./gen_config.json
	# Add a hacky redir from index, since index doesn't have any content...
	cat index.html | sed 's#<meta charset="UTF-8">#<meta http-equiv="Refresh" content="0; url='"'"'/blog'"'"'" />#g' > tmp
	mv tmp index.html

publish: gen
	git add blog* md_blog*
	git commit -am 'Publish post' && git push

favicon.ico:
	wget https://openverse.org/image/b7a1247d-e959-4e46-a881-8b905627cae2?q=monkey

install_sysdeps:
	sudo apt install python3-markdown

