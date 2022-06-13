import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { billingAddressNickname } from '../../../selectors'

const BillingAddressDetails = ({ orderPayment }) => {
  const { billingAddress = {} } = orderPayment
  const { name, streetAddress, city, stateCode, postalCode, emailAddress } = billingAddress
  const { t } = useTranslation()
  let billingNickname = useSelector(billingAddressNickname)

  return (
    <>
      {Object.values(billingAddress).filter(value => value && value.length).length > 0 && (
        <>
          <h6 className="h6">{t('frontend.checkout.billing_address')}</h6>
          {billingAddress && (
            <p>
              {billingNickname && (
                <>
                  <em>{billingNickname}</em>
                  <br />
                </>
              )}
              {name} <br />
              {streetAddress} <br />
              {`${city}, ${stateCode} ${postalCode}`} <br />
              <span className="text-truncate text-dark d-block">{emailAddress && emailAddress}</span>
            </p>
          )}
        </>
      )}
    </>
  )
}

export { BillingAddressDetails }
