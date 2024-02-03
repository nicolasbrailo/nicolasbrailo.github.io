blog_md: blogspot_to_md.py blog-01-28-2024.xml
	python3 ./blogspot_to_md.py ./blog-01-28-2024.xml ./blog_md

blog/index.html: mdtohtml.py buildsite.py
	python3 ./buildsite.py ./blog_md ./blog index

.PHONY: blog
blog: mdtohtml.py buildsite.py
	python3 ./buildsite.py ./blog_md ./blog full

