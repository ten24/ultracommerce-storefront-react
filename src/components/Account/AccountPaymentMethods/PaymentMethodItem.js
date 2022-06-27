import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { useDispatch } from 'react-redux'
import { deletePaymentMethod, setPrimaryPaymentMethod } from '../../../actions/'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

const PaymentMethodItem = props => {
  const { accountPaymentMethodID, isPrimary = false, creditCardType, expirationYear, expirationMonth, creditCardLastFour, accountPaymentMethodName } = props
  const MySwal = withReactContent(Swal)
  const dispatch = useDispatch()
  const { t } = useTranslation()

  return (
    <tr>
      <td className="py-2">
        <div className="media align-items-center">
          <div className="media-body">
            <div> {accountPaymentMethodName && <b>{`${creditCardType} Ending in x${creditCardLastFour} - ${accountPaymentMethodName}`}</b>}</div>
            <div>{!accountPaymentMethodName && <b>{`${creditCardType} Ending in x${creditCardLastFour}`}</b>} </div>
            <div>{`Exp: ${expirationMonth}/${expirationYear}`}</div>
          </div>
        </div>
      </td>
      <td className="py-2">
        {' '}
        {isPrimary ? (
          <span className="badge bg-info">{t('frontend.core.prinary')}</span>
        ) : (
          <button
            type="button"
            className="link-button link nav-link-style"
            onClick={() => {
              MySwal.fire({
                icon: 'info',
                title: <p>{t('frontend.payment.setAsPrimary')}</p>,
                showCloseButton: true,
                showCancelButton: true,
                focusConfirm: false,
                confirmButtonText: t('frontend.payment.button.setAsPrimary'),
              }).then(data => {
                if (data.isConfirmed) {
                  dispatch(setPrimaryPaymentMethod(accountPaymentMethodID)).then(response => {
                    if (response.isSuccess()) {
                      toast.success(t('frontend.primaryFlag.successMessage'))
                    } else {
                      toast.error(t('frontend.primaryFlag.errorMessage'))
                    }
                  })
                }
              })
            }}
          >
            {t('frontend.payment.button.setAsPrimary')}
          </button>
        )}{' '}
      </td>
      <td className="py-2">
        <button
          type="button"
          className="link-button nav-link-style link"
          onClick={() => {
            MySwal.fire({
              icon: 'info',
              title: <p>{t('frontend.account.payment_method.remove')}</p>,
              showCloseButton: true,
              showCancelButton: true,
              focusConfirm: false,
              confirmButtonText: t('frontend.core.delete'),
            }).then(data => {
              if (data.isConfirmed) {
                dispatch(deletePaymentMethod(accountPaymentMethodID))
              }
            })
          }}
          data-toggle="tooltip"
          title=""
          data-original-title="Remove"
        >
          {t(`frontend.core.remove`)}
        </button>
      </td>
    </tr>
  )
}
export { PaymentMethodItem }
