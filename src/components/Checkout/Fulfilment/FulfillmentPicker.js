import { SwRadioSelect } from '../../'
import { useTranslation } from 'react-i18next'

const FulfillmentPicker = ({ orderItems, eligibleFulfillmentMethods, onSelect, onChangeOrderFullfillment, selectedFulfillmentMethod }) => {
  const { t } = useTranslation()
  const orderItemIDList = orderItems
    .map(orderItem => {
      return orderItem.orderItemID
    })
    .join()
  return (
    <div className="row mb-3">
      <div className="col-sm-12">
        {eligibleFulfillmentMethods && eligibleFulfillmentMethods.length > 0 && (
          <SwRadioSelect
            label={t('frontend.checkout.receive_option')}
            options={eligibleFulfillmentMethods}
            onChange={fulfillmentMethodID => {
              onChangeOrderFullfillment(fulfillmentMethodID, orderItemIDList)
              onSelect()
            }}
            selectedValue={selectedFulfillmentMethod.fulfillmentMethodID}
          />
        )}
      </div>
    </div>
  )
}

export { FulfillmentPicker }
