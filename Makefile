.PHONY: deploy status cleanUpload clearDist build rebuild public
deploy:
	qscamel run online-exam-upload -t upload-qingstor.yaml
uploadStatus:
	qscamel status
cleanUpload:
	qscamel clean
clearDist:
	rm -rf dist/
build:
	npm run build:prod
rebuild: clearDist build

publish: rebuild cleanUpload deploy
