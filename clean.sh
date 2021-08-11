#!/bin/sh

rm package-lock.json
rm -rf typetests
rm -rf vanillatype
rm -rf maskingtape.css
rm -rf node_modules
npm upgrade
./setupdev.sh

