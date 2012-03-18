#!/usr/bin/env runghc

import System.Directory
import System.Process
import List

main = do
    hazNginx <- doesFileExist "/etc/init.d/nginx"
    hazNginxConf <- doesDirectoryExist "/etc/nginx/sites-enabled"
    if not (hazNginx || hazNginxConf)
        then do
            putStrLn "Could not find /etc/init.d/nginx - nginx not installed?"
            fail "prerequisite failed: nginx"
        else
            return ()
    -- yeah baby
    copyFile "nginx-plyply.com" "/etc/nginx/sites-enabled/plyply.com"
    removeDirectoryRecursive "/var/www-plyply/"
    _ <- readProcess "cp" ["-r", "www", "/var/www-plyply"] ""
    _ <- readProcess "/etc/init.d/nginx" ["reload"] ""
    nginxState <- readProcess "/etc/init.d/nginx" ["status"] ""
    if "running" `elem` (words nginxState)
        then
            return ()
        else
            putStrLn $ "Warning: nginx not running."
