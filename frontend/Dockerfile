FROM nginx:alpine
COPY index.html /usr/share/nginx/html/index.html
COPY css /usr/share/nginx/html/css
COPY js /usr/share/nginx/html/js
COPY .nojekyll /usr/share/nginx/html/.nojekyll
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
