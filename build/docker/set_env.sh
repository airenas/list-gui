#!/bin/sh
echo Configuring BASE_HREF to "$BASE_HREF"
sed -i "s|<base href=\"/\">|<base href=\"$BASE_HREF\">|" /usr/share/nginx/html/index.html

echo Configuring SERVICE_URL to "$SERVICE_URL"
sed -i "s|https://atpazinimas.intelektika.lt/ausis|$SERVICE_URL|" /usr/share/nginx/html/index.html
echo Env conf done