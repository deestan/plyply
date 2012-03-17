#!/usr/bin/env runghc

import System.Directory

main = do
    hazNginx <- doesFileExist "/etc/init.d/nginx"
    if not hazNginx then do
        putStrLn "Could not find /etc/init.d/nginx - nginx not installed?"
        fail "prerequisite failed: nginx"
    else return ()
    putStrLn "All good"