-include ../Makefile.options
-include ../../version
#####################################################################################
dist_dir=$(CURDIR)/deploy
main_dir=../../
source_dir=../../deploy/html
service=list-gui
#####################################################################################
$(dist_dir):
	mkdir -p $@
$(dist_dir)/html:
	mkdir -p $@

$(dist_dir)/.build: | $(dist_dir)/html
	cd $(main_dir) && $(MAKE) build
	cp -r $(source_dir)/* $(dist_dir)/html
	cp index.html $(dist_dir)/html/
	touch $(dist_dir)/.build

$(dist_dir)/html/index.html: index.html $(dist_dir)/.build 
	cp index.html $(dist_dir)/html/

build: $(dist_dir)/.build $(dist_dir)/html/index.html
########### DOCKER ##################################################################
tag=airenas/$(service):$(version)

dbuild: build
	docker build -t $(tag) --build-arg BUILD_VERSION=$(version) ./

dpush: dbuild
	docker push $(tag)
dscan: dbuild	
	docker scan --accept-license $(tag)
########### END #####################################################################
clean:
	cd $(main_dir) && $(MAKE) clean
	rm -rf $(dist_dir)

.PHONY:
	clean dbuild dpush build 
