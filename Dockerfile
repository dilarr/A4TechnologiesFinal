FROM nginx:alpine

WORKDIR /usr/share/nginx/html

RUN rm -rf ./*

COPY index.html .
COPY CSS ./CSS
COPY Images ./Images
COPY ProjectPages ./ProjectPages
COPY Script ./Script
COPY Video ./Video

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]