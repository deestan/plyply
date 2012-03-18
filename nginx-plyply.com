server {
  listen 80;
  server_name plyply.com;
  rewrite ^ http://www.plyply.com$request.uri?;
}

server {
  types {
    application/x-msi msi;
    audio/wav         wav;
  }
  listen 80;
  server_name www.plyply.com test.plyply.com;
  root /var/www-plyply/;
}
