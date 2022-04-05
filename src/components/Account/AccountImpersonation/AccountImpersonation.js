import { AccountLayout, AccountContent } from '../../'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { useFormik } from 'formik'
import { toast } from 'react-toastify'
import { getUser, getWishLists, receiveCart, receiveUser } from '../../../actions'
import { SlatwalApiService } from '../../../services'
import { getErrorMessage, isImpersonating } from '../../../utils'

const AccountImpersonation = ({ crumbs, title, customBody, contentTitle }) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()

  const impersonateAccount = user => {
    return SlatwalApiService.account.impersonateAccount(user).then(response => {
      if (response.isSuccess() && Object.keys(response.success()?.errors || {}).length) toast.error(getErrorMessage(response.success().errors))
      if (response.isSuccess()) {
        toast.success(t('frontend.account.start_impersonation_successful'))
        dispatch(receiveUser(response.success().account))
        dispatch(receiveCart(response.success().cart))
        dispatch(getWishLists(true))
      } else {
        toast.error(t('frontend.account.start_impersonation_failed'))
      }
      return response
    })
  }

  const endImpersonation = () => {
    return SlatwalApiService.account.endImpersonation().then(response => {
      if (response.isSuccess() && Object.keys(response.success()?.errors || {}).length) toast.error(getErrorMessage(response.success().errors))
      if (response.isSuccess()) {
        toast.success(t('frontend.account.end_impersonation_successful'))
        dispatch(getUser())
        dispatch(receiveCart(response.success().cart))
        dispatch(getWishLists(true))
      } else {
        toast.error(t('frontend.account.end_impersonation_failed'))
      }
    })
  }

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      emailAddress: '',
    },
    onSubmit: (values, { setSubmitting }) => {
      impersonateAccount({
        emailAddress: values.impersonateEmailAddress,
        returnJSONObjects: 'account,cart',
      })
      setSubmitting(false)
    },
  })

  return (
    <AccountLayout crumbs={crumbs} title={title}>
      <AccountContent customBody={customBody} contentTitle={contentTitle} />
      <div className="row">
        <div className="col-sm-12">
          <h4 className="text-left my-lg-4">{t('frontend.account.account_impersonation')}</h4>
        </div>
        {isImpersonating() && (
          <div className="col-12">
            <hr className="mt-2 mb-3" />
            <div className="d-flex flex-wrap justify-content-end">
              <button
                type="submit"
                className="btn btn-primary mt-3 mt-sm-0"
                onClick={e => {
                  e.preventDefault()
                  endImpersonation()
                }}
              >
                {t('frontend.account.end_impersonation')}
              </button>
            </div>
          </div>
        )}
        {!isImpersonating() && (
          <form onSubmit={formik.handleSubmit} className="col-12">
            <div className="col-sm-6">
              <div className="form-group">
                <label htmlFor="impersonateEmailAddress">{t('frontend.account.customer_email')}</label>
                <input className="form-control" type="email" id="impersonateEmailAddress" value={formik.values.impersonateEmailAddress} onChange={formik.handleChange}></input>
              </div>
            </div>
            <div className="col-12">
              <hr className="mt-2 mb-3" />
              <div className="d-flex flex-wrap justify-content-end">
                <button type="submit" disabled={formik.isSubmitting} className="btn btn-primary mt-3 mt-sm-0">
                  {t('frontend.account.start_impersonation')}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </AccountLayout>
  )
}

export { AccountImpersonation }
