#!/bin/sh

echo "----------------------------------------";
echo "--------- UPDATE NPM PACKAGE -----------";
echo "----------------------------------------";

git add .
git commit -m "clean up"
git push

echo "---------- NEUES PATCH RELEASE --------";
echo "---------------------------------------";
npm run release:patch

PACKAGE_VERSION=$(node -p "require('./package.json').version")


echo "------------ PUBLISH TO NPMJS ---------";
echo "---------------------------------------";
git add .
git commit -m "Release DEV $PACKAGE_VERSION"
npm run build
npm publish
