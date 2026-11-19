# 토익 900 데일리

S·V·C·O·M 노트 기반 토익 학습 사이트 — https://kkachi980208.github.io/toeic900/

| 파일 | 역할 |
|---|---|
| index.html | 앱 전체 (src/ → build.sh로 조립, 직접 수정하지 않음) |
| src/ | 소스: 스타일, 화면, 단원 노트·문제(data_units.js), 분석 엔진(app_main.js) |
| bank.json | 매일 자동 추가되는 문제. 앱이 열릴 때 읽음 |
| updates.json | 개선 기록. 설정 탭에 표시 |
| manifest.webmanifest, sw.js, icon-*.png | 홈 화면 설치·오프라인 지원 |

bank.json 항목: `{"id":"20261120-u5-1","kind":"g","u":"u5","r":"S","s":"... ____ ...","c":["a","b","c","d"],"a":1,"e":"해설","added":"2026-11-20"}`

학습 기록은 각 기기 브라우저에 저장. 기기 이동은 설정 → 백업·복원.
