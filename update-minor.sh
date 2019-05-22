#!/bin/sh

echo "----------------------------------------";
echo "--------- UPDATE NPM PACKAGE -----------";
echo "----------------------------------------";

git add .
git commit -m "clean up"
git push

echo "--------- NEUES MINOR RELEASE ---------";
echo "---------------------------------------";
npm run release:minor

PACKAGE_VERSION=$(node -p "require('./package.json').version")


echo "------------ PUBLISH TO NPMJS ---------";
echo "---------------------------------------";
git add .
git commit -m "Release DEV $PACKAGE_VERSION"
npm run build
npm publish
