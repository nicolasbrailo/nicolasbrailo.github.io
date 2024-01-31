POSTS_MD_PATH:=src_md
POSTS_HTML_PATH:=www

.PHONY: reimport
reimport: imported_date
imported_date: blogspot_to_md.py blog-01-28-2024.xml
	mkdir -p $(POSTS_MD_PATH)
	python3 ./blogspot_to_md.py blog-01-28-2024.xml $(POSTS_MD_PATH)
	touch imported_date

deps.mk: imported_date
	find "$(POSTS_MD_PATH)" -type f -name '*.md' | \
		sed 's/\.md$$//g' | \
		sed "s/"$(POSTS_MD_PATH)"\///g" | \
		awk '{print "'$(POSTS_HTML_PATH)'/"$$0".html: '$(POSTS_MD_PATH)'/"$$0".md"}' > singledeps.mk
	cat singledeps.mk > deps.mk
	echo ".PHONY: build_all" >> deps.mk
	echo "build_all: \\" >> deps.mk
	cat singledeps.mk  | awk -F':' '{print "  "$$1" \\"}' >> deps.mk
	rm singledeps.mk

include deps.mk

$(POSTS_HTML_PATH)/%.html: $(POSTS_MD_PATH)/%.md
	mkdir -p $(shell dirname $@)
	cat $^ | python3 ./mdtohtml.py > $@

