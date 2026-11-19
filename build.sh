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
sed -n '/^<script>$/,/^<\/script>$/p' index.html | sed '1d;$d' | head -n -0 > /tmp/_check.js
node --check /tmp/_check.js 2>/dev/null && echo "BUILD OK" || echo "주의: node 없음 또는 문법 오류 — 확인 필요"
