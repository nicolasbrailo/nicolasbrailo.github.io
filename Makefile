POSTS_MD_PATH:=src_md
POSTS_HTML_PATH:=www

.PHONY: reimport
reimport: imported_date
imported_date: blogspot_to_md.py blog-01-28-2024.xml
	mkdir -p $(POSTS_MD_PATH)
	python3 ./blogspot_to_md.py blog-01-28-2024.xml $(POSTS_MD_PATH)
	touch imported_date

