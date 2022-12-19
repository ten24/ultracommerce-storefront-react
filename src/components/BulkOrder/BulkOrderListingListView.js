import { NoProductFound, Spinner } from '..'
import { useTranslation } from 'react-i18next'
import { SkuRow } from '../Listing/SearchDisplayModes'

const BulkOrderListingListView = ({ Card = { SkuRow }, isFetching, pageRecords, list, config, onButtonClick, onInputChange }) => {
  const { t } = useTranslation()
  // const {headings} = config TODO: use this one day to make headings dynamic
  return (
    <>
      {isFetching && <Spinner />}
      {!isFetching && (
        <table className="table table-styled">
          <thead>
            <tr>
              <th scope="col"></th>
              <th scope="col">{t('frontend.bulkorder.listview.modal.sku')}:</th>
              <th scope="col">{t('frontend.bulkorder.listview.price')}:</th>
              <th scope="col">{t('frontend.bulkorder.listview.qty')}:</th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody>
            {!isFetching &&
              pageRecords.length > 0 &&
              pageRecords.map((product, index) => {
                return <Card config={config} quantity={list[product.sku_skuID] ? list[product.sku_skuID]?.quantity : 0} key={`${product.skuID}=${index}`} product={product} onButtonClick={onButtonClick} onInputChange={onInputChange} />
              })}
          </tbody>
        </table>
      )}
      {!isFetching && pageRecords.length === 0 && <NoProductFound />}
    </>
  )
}

export { BulkOrderListingListView }
