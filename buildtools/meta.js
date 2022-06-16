const fs = require('fs')
const pac = require('../package.json')
fs.appendFileSync(`${__dirname}/../.env`, `\nREACT_APP_SDK_VERSION=${pac.dependencies['@ultracommerce/ultracommerce-sdk']}`)
fs.appendFileSync(`${__dirname}/../.env`, `\nREACT_APP_CORE_VERSION=${pac.dependencies['@ultracommerce/ultracommerce-storefront-react']}`)
