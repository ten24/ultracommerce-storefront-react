#!/bin/bash


# for Core

rm -rf node_modules
rm -rf ./{public,buildtools,resourceBundles,src} 
cp -r ../slatwall-storefront-react-private/{public,buildtools,resourceBundles,src}  ./
find ./src -type f -name '*.js' -exec sed -i '' "s/\@ten24\/slatwall/\@ultracommerce\/ultracommerce/g" {} +
find ./src -type f -name '*.js' -exec sed -i '' "s/sdk-private/sdk/g" {} +

rm -rf src/preload.js
cp  ../slatwall-storefront-react-private/src/preload.js ./src/preload.js
rm -rf ./package.json
cp  ../slatwall-storefront-react-private/package.json ./package.json
find ./package.json -type f -exec sed -i '' "s/\@ten24\/slatwall/\@ultracommerce\/ultracommerce/g" {} +
find ./package.json -type f -exec sed -i  '' "s/-private//g" {} +
find ./package.json -type f -exec sed -i  '' "s/npm.pkg.github.com/registry.npmjs.org/g" {} +
sed -i.bak '10i\
  "bugs": {\
    "url": "https://github.com/ten24/ultracommerce-storefront-react/issues"\
  },\
  "repository": {\
    "type": "git",\
    "url": "git+https://github.com/ten24/ultracommerce-storefront-react.git"\
  },\
' package.json