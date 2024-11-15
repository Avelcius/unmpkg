unmpkg
A tool for unpacking mpkg files exported by Wallpaper Engine
Introduction
A tool inspired by this project

The big guy's program can only be run on Unix-like systems, and Windows users find it very uncomfortable.

Usage

```text
Usage: unmpkg <filename>
Example: unmpkg test.mpkg
```
principle
The encoding method of mpkg format is as follows (the - in the middle is to make it easier to distinguish what each paragraph is, and the content in brackets is the number of bytes occupied):

Version number length (4b) - version number (8b) - number of files (4b) - first file name length (4b) - first file name - first file index (4b) - first file length ( 4b) - Second file name length (4b) -…
