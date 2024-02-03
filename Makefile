
blog_md: genscripts/blogspot_to_md.py genscripts/localize_md_images.py blog-01-28-2024.xml
	python3 ./genscripts/blogspot_to_md.py ./blog-01-28-2024.xml ./blog_md
	python3 ./genscripts/localize_md_images.py ./blog_md ./blog_img
	python3 ./genscripts/localize_links.py ./blog_md

blog/index.html: genscripts/mdtohtml.py genscripts/buildsite.py
	python3 ./genscripts/buildsite.py ./blog_md ./blog index

.PHONY: blog
blog: genscripts/mdtohtml.py genscripts/buildsite.py
	python3 ./genscripts/buildsite.py ./blog_md ./blog full

