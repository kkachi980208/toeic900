#!/bin/bash
# src/ 파일을 조립해 index.html을 만든다. 수정은 src/에서 하고 이 스크립트를 실행.
set -e
cd "$(dirname "$0")"
{
  cat src/site_head.html
  cat src/style_old.css src/style_new.css
  echo "</style>"
  cat src/body.html
  echo "<script>"
  echo "(function(){"
  cat src/app_head.js src/data_old.js src/data_units.js src/app_main.js src/mock.js src/log.js src/init.js
  echo "})();"
  echo "</script>"
  cat src/site_tail.html
} > index.html
# 앱 스크립트(첫 번째 <script> 블록)만 꺼내 문법 검사
awk '/^<script>$/{f++; if(f==1){on=1; next}} on&&/^<\/script>$/{exit} on' index.html > /tmp/_check.js
node --check /tmp/_check.js && echo "BUILD OK"
