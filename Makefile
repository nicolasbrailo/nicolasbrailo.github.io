.PHONY: blog/index.html
blog/index.html: genscripts/mdtohtml.py genscripts/buildsite.py
	python3 ./genscripts/buildsite.py ./blog_md ./blog index

.PHONY: blog
blog: genscripts/mdtohtml.py genscripts/buildsite.py
	python3 ./genscripts/buildsite.py ./blog_md ./blog full

style.css:
	wget https://unpkg.com/chota@latest
	mv chota@latest style.css

