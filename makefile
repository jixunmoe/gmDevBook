all:
	-mkdir build
	nodejs build.js
	# 压缩脚本, 详细日志请参考 build.log
	closure-compiler --compilation_level SIMPLE_OPTIMIZATIONS --js build/App.d.js --js_output_file build/App.js > build.log 2>&1
	rm build/App.d.js

