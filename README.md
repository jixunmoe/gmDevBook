# 关于该项目
这是一个很有爱的中文 GreaseMonkey 用户脚本开发手册 :3

手册采用下述开源库进行开发：

* Angular JS
* ANgular UI (ui-router)
* Bootstrap
* jQuery

该项目于 [Firefox8](http://firefox8.qiniudn.com/doc/index.html) 获得灵感制作而成，其中 API 资料均从 [GM 官方百科](http://wiki.greasespot.net/)提取翻译而成。

# 安装
首先需要安装 Bower。
```bash
sudo npm install bower -g
```

执行 `bower install` 安装所需第三方库 (Angular, Bootstrap, jQuery)

如果需要压缩小册子为 index + css + js 这三个文档的话执行 `make` 即可 (需要安装 closure-compiler、nodejs、npm、sass)。
```bash
# Ubuntu 下安装依赖项 (未测试)
sudo apt-get install libclosure-compiler-java nodejs npm ruby
# 安装 sass
sudo gem install sass
# 安装构建用的库
npm install
```
