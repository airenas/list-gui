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
serve-local-prepared: 
	cp example/index.html $(dist_dir)/
	docker run -p $(port):80 -v $(dist_dir):/usr/share/nginx/html nginx:1.17.9	
#####################################################################################
files=main-es5.js main-es2015.js polyfills-es5.js polyfills-es2015.js runtime-es5.js runtime-es2015.js \
	3rdpartylicenses.txt styles.css info scripts.js WebAudioRecorderWav.min.js
trans_files=$(patsubst %, $(dist_dir)/trans/%, $(files))
$(dist_dir)/trans/3rdpartylicenses.txt: $(dist_dir)/html/3rdpartylicenses.txt | $(dist_dir)/trans
	cp $(dist_dir)/html/3rdpartylicenses.txt $@	
	printf "\n\n\nwavesurfer\n" >> $@ && cat Licenses/LICENSE.wavesurfer >> $@
	printf "\n\n\nWebAudioRecorder\n" >> $@ && cat Licenses/LICENSE.WebAudioRecorder >> $@
$(dist_dir)/trans/%: $(dist_dir)/html/% | $(dist_dir)/trans
	cp $< $@
$(dist_dir)/trans/%: $(dist_dir)/html/trans/% | $(dist_dir)/trans
	cp $< $@
$(dist_dir)/trans/info: $(dist_dir)/trans | $(dist_dir)/trans
	echo version : $(version) > $@
	echo date    : $(shell date --rfc-3339=seconds) >> $@

pack: trans-component-$(version).tar.gz
$(dist_dir)/trans:
	mkdir -p $@
trans-component-$(version).tar.gz: $(trans_files) $(dist_dir)/.build | $(dist_dir)/trans
	tar -czf $@ -C $(dist_dir) trans
#####################################################################################
clean:
	rm -rf $(dist_dir)

.PHONY:
	clean build updateVersion
