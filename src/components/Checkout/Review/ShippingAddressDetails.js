import { useTranslation } from 'react-i18next'

const ShippingAddressDetails = ({ shippingAddress, shippingAddressNickname }) => {
  const { name, streetAddress, city, stateCode, postalCode, emailAddress, shippingMethod } = shippingAddress || {}
  const { t } = useTranslation()
  return (
    <>
      <h6 className="h6">{t('frontend.checkout.shipping_address')}</h6>
      <p>
        {shippingAddressNickname && (
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
      
      <h6 className="h6">{t('frontend.checkout.shippingMethod')}</h6>
      <p>{shippingMethod}</p>
    </>
  )
}

export { ShippingAddressDetails }
