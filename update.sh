#!/bin/bash


# for Core

# rm -rf node_modules
# rm -rf ./{public,buildtools,resourceBundles,src} 
# cp -r ../slatwall-storefront-react-private/{public,buildtools,resourceBundles,src}  ./
# find ./src -type f -name '*.js' -exec sed -i '' "s/\@ten24\/slatwall/\@slatwall\/slatwall/g" {} +
# find ./src -type f -name '*.js' -exec sed -i '' "s/slatwall-sdk-private/slatwall-sdk/g" {} +

# rm -rf src/preload.js
# cp  ../slatwall-storefront-react-private/src/preload.js ./src/preload.js


# for store

rm -rf node_modules
rm -rf ./{public,buildtools,src} 
cp -r ../slatwalldemo-storefront/{public,buildtools,src}  ./
find ./src -type f -name '*.scss' -exec sed -i '' "s/\@ten24\/slatwall/\@slatwall\/slatwall/g" {} +
find ./src -type f -name '*.scss' -exec sed -i '' "s/slatwall-storefront-react-private/slatwall-storefront-react/g" {} 
find ./src -type f -name '*.js' -exec sed -i '' "s/\@ten24\/slatwall/\@slatwall\/slatwall/g" {} +
find ./src -type f -name '*.js' -exec sed -i '' "s/slatwall-sdk-private/slatwall-sdk/g" {} +
find ./src -type f -name '*.js' -exec sed -i '' "s/slatwall-storefront-react-private/slatwall-storefront-react/g" {} +
