
refresh:
	python3 ./genscripts/blogspot_to_md.py ./blog-02-03-2024.xml ./blog_md
	python3 ./genscripts/localize_md_images.py ./blog_md ./blog_img
	python3 ./genscripts/localize_links.py ./blog_md

blog_md: genscripts/blogspot_to_md.py genscripts/localize_md_images.py blog-02-03-2024.xml
	python3 ./genscripts/blogspot_to_md.py ./blog-02-03-2024.xml ./blog_md

localize_imgs:
	python3 ./genscripts/localize_md_images.py ./blog_md ./blog_img

localize_links:
	python3 ./genscripts/localize_links.py ./blog_md

.PHONY: clean
clean:
	rm -rf blog_md blog blog_img

.PHONY: blog/index.html
blog/index.html: genscripts/mdtohtml.py genscripts/buildsite.py
	python3 ./genscripts/buildsite.py ./blog_md ./blog index

.PHONY: blog
blog: genscripts/mdtohtml.py genscripts/buildsite.py
	python3 ./genscripts/buildsite.py ./blog_md ./blog full

