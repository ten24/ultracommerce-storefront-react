import { useTranslation } from 'react-i18next'

const ShippingAddressDetails = ({ shippingAddress, shippingAddressNickname }) => {
  const { name, streetAddress, city, stateCode, postalCode, emailAddress } = shippingAddress || {}
  const { t } = useTranslation()
  return (
    <>
      <h6 className="h6">{t('frontend.checkout.shipping_address')}</h6>
      <p className="mb-1">
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
    </>
  )
}

export { ShippingAddressDetails }
