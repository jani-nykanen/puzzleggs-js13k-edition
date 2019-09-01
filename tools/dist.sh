#!/bin/sh
cd "$(dirname "$0")"
java -jar closure.jar --js ../src/*.js --js_output_file out.js --compilation_level ADVANCED_OPTIMIZATIONS --language_out ECMASCRIPT_2018
cat html_up.txt > index.html
cat out.js >> index.html
cat html_down.txt >> index.html
zip -r ../dist.zip index.html
advzip -z ../dist.zip
rm index.html
