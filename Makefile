.PHONY: reimport
reimport: imported_date
imported_date: blogspot_to_md.py blog-01-28-2024.xml
	python3 ./blogspot_to_md.py blog-01-28-2024.xml
	touch imported_date

.PHONY: deps.mk
deps.mk:
	$(shell find | grep '\.md' | awk -F'.md' '{print $1": "$0}' > deps.mk )

www_posts/%.html: reimport %.md
	mkdir -p $(shell dirname $@)
	cat $^ | python3 ./mdtohtml.py > $@

