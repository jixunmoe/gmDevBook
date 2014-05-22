// Build Site, require node js.

var fs = require ('fs');
var CleanCSS = require('clean-css');
var HTMLMin  = require('html-minifier').minify;

var outDir = './build/';

var indexFile = fs.readFileSync('./index.html').toString();

var rmComment = function (r) {
	return r.replace(/<!--[\s\S]*?-->/g, '');
};

var writeFile = function (writeTo, fileContent) {
	console.log ('Write to: %s', writeTo);
	fs.writeFileSync(outDir + writeTo, fileContent);
};

var minHTML = function (HTML) {
	return HTMLMin (HTML.toString(), {
		removeComments: true,
		removeCommentsFromCDATA: true,
		removeCDATASectionsFromCDATA: true,
		collapseWhitespace: true,
		conservativeCollapse: true,
		collapseBooleanAttributes: true,
		// removeAttributeQuotes: true,
		removeRedundantAttributes: true,
		// removeEmptyAttributes: true,
		removeOptionalTags: true,
		// removeEmptyElements: true,
		keepClosingSlash: true,
		caseSensitive: true
	});
};

var procDir = function (dirName) {
	var ret = '';
	console.log ('Build directory: %s', dirName);
	fs.readdirSync (dirName).forEach (function (file) {
		var curPath = dirName + file;
		if (fs.lstatSync(curPath).isDirectory()) {
			ret += procDir (curPath + '/');
			return ;
		}

		// Process file
		console.log ('Add file: %s', curPath);
		ret += '<script type="text/ng-template" id="' + curPath.slice(2) + '">' + 
				minHTML(fs.readFileSync (curPath)) + '</script>';
	});

	return ret ;
};

// 构建 CSS 档
writeFile ('index.html', minHTML(indexFile.replace (/<\!--CSS\:START-->[\s\S]+<\!--CSS\:END-->/g, function (z) {
	var css = '';
	rmComment(z).replace (/href="(.+?)"/g, function (z, link) {
		css += fs.readFileSync (link).toString();
	});
	
	writeFile ('App.css', new CleanCSS().minify(css.replace(/\/\*[\s\S]*?\*\//g, '')));
	return '<link rel="stylesheet" href="App.css">';
}).

	// 构建 JS 档
	replace (/<\!--JS\:START-->[\s\S]+<\!--JS\:END-->/g, function (z) {
	var js = '';
	rmComment(z).replace (/src="(.+?)"/g, function (z, src) {
		js += '\n;' + fs.readFileSync (src).toString();
	});

	writeFile ('App.d.js',
		js.slice(1)
	);
	return '<script src="App.js"></script>';
}).
	// 构建全部 HTML 页面到一个文件
	replace('<!--TEMPLATE-->', procDir ('./tpl/') + procDir ('./doc/'))));