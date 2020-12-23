-include ../Makefile.options
#####################################################################################
dist_dir=$(CURDIR)/deploy
port?=8000
main_dir=ear-app
commit_count=$(shell git rev-list --count HEAD)
COMPONENT_VERSION?=0.1
version=$(COMPONENT_VERSION).$(commit_count)
#####################################################################################
init: 
	cd $(main_dir) && npm ci
test: 
	cd $(main_dir) && ng test
#####################################################################################
$(dist_dir):
	mkdir -p $(dist_dir)

updateVersion: | $(dist_dir)
	cat $(main_dir)/src/environments/environment.prod.sample \
		| sed 's/BUILD_VERSION/$(version)/g' > $(dist_dir)/environment.prod.ts
	rsync --checksum $(dist_dir)/environment.prod.ts $(main_dir)/src/environments/environment.prod.ts	

$(dist_dir)/.build: $(main_dir) $(main_dir)/src $(main_dir)/src/environments/environment.prod.ts
	cd $(main_dir) && ng build --prod --output-path=$(dist_dir)/html --base-href / --output-hashing none
	touch $(dist_dir)/.build

build: updateVersion $(dist_dir)/.build
#####################################################################################
serve-local:
	docker run -p $(port):80 -v $(dist_dir)/html:/usr/share/nginx/html nginx:1.17.9
#####################################################################################
files=main-es5.js main-es2015.js polyfills-es5.js polyfills-es2015.js runtime-es5.js runtime-es2015.js \
	3rdpartylicenses.txt styles.css info
list_files=$(patsubst %, $(dist_dir)/tts/%, $(files))
$(dist_dir)/list/%: $(dist_dir)/html/% | $(dist_dir)/list
	cp $< $@
$(dist_dir)/list/info: $(dist_dir)/list | $(dist_dir)/list
	echo version : $(version) > $@
	echo date    : $(shell date) >> $@

pack: list-component-$(version).tar.gz
$(dist_dir)/list:
	mkdir -p $@
list-component-$(version).tar.gz: $(list_files) $(dist_dir)/.build | $(dist_dir)/list
	tar -czf $@ -C $(dist_dir) list
#####################################################################################
clean:
	rm -rf $(dist_dir)

.PHONY:
	clean build updateVersion
