import { useEffect, useState } from 'react'
import { axios, sdkURL } from '../../services'
import { ProductBundleItems, BundleConfig } from '../../components'

const ProductBundle = ({ productBundle, productBundleBuildOnAccount, productID }) => {
  const [bundlesOnAccount, setBundlesOnAccount] = useState({})
  const [bundleBuildsOnAccount, setBundleBuildsOnAccount] = useState(productBundleBuildOnAccount)

  useEffect(() => {
    if (bundleBuildsOnAccount) {
      let skuIDs = []
      skuIDs = bundleBuildsOnAccount?.bundleItems.map(item => item.sku_skuID)

      axios({
        method: 'GET',
        withCredentials: true,
        url: `${sdkURL}api/public/sku`,
        params: { 'f:skuID:eq': skuIDs.join(',') },
        headers: {
          'Content-Type': 'application/json',
        },
      }).then(response => {
        if (response && !response.data?.failureActions.length) {
          if (response.data.data.pageRecords.length) {
            let obj = {}
            response.data.data.pageRecords.map(item => (obj[item.skuID] = item))
            bundleBuildsOnAccount?.bundleItems.map(item => {
              if (`${item.sku_skuID}` in obj) {
                obj[item.sku_skuID].quantity = item.quantity
                obj[item.sku_skuID].productBundleBuildItemID = item?.productBundleBuildItemID
              }
              return obj
            })
            setBundlesOnAccount(obj)
          }
        }
      })
    }
  }, [bundleBuildsOnAccount])

  return (
    <>
      <BundleConfig bundlesOnAccount={bundlesOnAccount} productBundleBuildID={bundleBuildsOnAccount?.productBundleBuildID} setBundlesOnAccount={setBundlesOnAccount} />
      {productBundle?.map(productBundleItem => (
        <ProductBundleItems key={productBundleItem.productBundleGroupID} bundlesOnAccount={bundlesOnAccount} productBundleItem={productBundleItem} productID={productID} setBundleBuildsOnAccount={setBundleBuildsOnAccount} />
      ))}
    </>
  )
}

export { ProductBundle }
