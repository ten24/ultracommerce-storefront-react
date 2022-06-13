import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { getAllAccountAddresses } from '../../../selectors'

const ShippingAddressDetails = ({ orderFulfillment, displayOnly = false }) => {
  const { name, streetAddress, city, stateCode, postalCode, emailAddress } = orderFulfillment?.shippingAddress || {}
  const { t } = useTranslation()
  let accountAddresses = useSelector(getAllAccountAddresses)
  let shippingAddressNickname =
    accountAddresses
      .filter(accountAddress => {
        return orderFulfillment?.shippingAddress && accountAddress.address.addressID === orderFulfillment?.shippingAddress.addressID
      })
      .map(({ accountAddressName }) => {
        return accountAddressName
      })
      ?.at(0) || ''
  return (
    <>
      <h6 className="h6">{t('frontend.checkout.shipping_address')}</h6>
      <p>
        {shippingAddressNickname?.length > 0 && (
          <>
            {shippingAddressNickname}
            <br />
          </>
        )}
        {name} <br />
        {streetAddress} <br />
        {`${city}, ${stateCode} ${postalCode}`} <br />
        <span className="text-truncate text-dark d-block">{emailAddress && emailAddress}</span>
      </p>

      {orderFulfillment?.shippingMethod?.shippingMethodName && (
        <>
          <h6 className="h6">{t('frontend.checkout.shippingMethod')}</h6>
          <p>{orderFulfillment?.shippingMethod?.shippingMethodName}</p>
        </>
      )}
      {!displayOnly && (
        <Link to="/checkout/shipping" className="text-link link mb-4 d-block">
          {t('frontend.core.edit')}
        </Link>
      )}
    </>
  )
}

export { ShippingAddressDetails }
