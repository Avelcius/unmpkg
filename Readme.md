# unmpkg

## 一个用于给Wallpaper Engine导出的mpkg文件解包的工具

### 简介

受 [该项目](https://github.com/nekoapa/unmpkg) 启发制作的一个工具

那位大佬的程序只能在类unix系统上跑，windows用户表示很难受

### 使用方式

```text
用法: unmpkg <filename>
实例: unmpkg test.mpkg
```

### 原理

`mpkg` 格式的编码方式如下（中间的 `-` 是为了便于区分每段是什么，括号内的内容是占用字节数）： 

版本号长度（4b）-版本号（8b）-文件数量（4b）-第一个文件名长度（4b）-第一个文件名-第一个文件索引（4b）-第一个文件长度（4b）-第二个文件名长度（4b）-……

