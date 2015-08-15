server {
  listen 80;
  server_name www.plyply.com plyply.com;
  rewrite ^ https://plyply.com$request_uri?;
}

server {
  listen 443 ssl;
  ssl on;
  ssl_certificate /etc/ssl/certs/plyply.com.crt;
  ssl_certificate_key /etc/ssl/private/plyply.com.key;

  types {
    application/x-msi msi;
    audio/wav         wav;
    text/html         html;
    text/css          css;
    image/png         png;
  }

  server_name plyply.com test.plyply.com;
  root /var/www-plyply/;
  index index.html;

  location /cv/ {
    proxy_pass http://localhost:8082/;
  }
}
