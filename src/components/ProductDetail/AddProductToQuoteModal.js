import { useTranslation } from 'react-i18next'
import { useState, useEffect } from 'react'
import { SwSelect, Button } from '..'
import { toast } from 'react-toastify'
import { SlatwalApiService } from '../../services'
import { getErrorMessage, isAuthenticated } from '../../utils'
import { useHistory } from 'react-router'
import { useDispatch } from 'react-redux'
import { addToOrder } from '../../actions'

const AddProductToQuoteModal = ({ sku, show, setQuoteModal }) => {
  const { t } = useTranslation()
  const history = useHistory()
  const [isLoading, setLoading] = useState(false)
  const [existingQuotes, setExistingQuotes] = useState([])
  const [existingQuoteVal, setExistingQuoteVal] = useState({})
  const [isLoaded, setLoaded] = useState(false)
  const [isLoadingForExisitingQuote, setLoadingForExistingQuote] = useState(false)
  const [quoteName, setQuoteName] = useState('')
  const dispatch = useDispatch()

  useEffect(() => {
    let didCancel = false
    if (!isLoaded) {
      SlatwalApiService.quotes.list({}).then(response => {
        if (response.isSuccess() && !didCancel && response.success().quotesOnAccount?.ordersOnAccount) {
          setExistingQuotes(
            response
              .success()
              .quotesOnAccount?.ordersOnAccount?.filter(quote => quote.orderStatusType_typeCode === 'qstDraft')
              .map(({ quoteName, orderID }) => ({ key: quoteName, value: orderID }))
          )
          setExistingQuoteVal(
            response
              .success()
              .quotesOnAccount?.ordersOnAccount?.filter(quote => quote.orderStatusType_typeCode === 'qstDraft')
              ?.at(0)?.['orderID']
          )
          setLoaded(true)
        } else {
          setExistingQuotes([])
          setLoaded(false)
        }
      })
    }

    return () => {
      didCancel = true
    }
    // eslint-disable-next-line
  }, [])

  return (
    <>
      {isAuthenticated() && existingQuotes.length > 0 && (
        <>
          <form name="add-to-exisiting-quote">
            <div className="row text-align-center">
              <div className="col-md-12 d-flex justify-content-center">
                <div className="form-group col-md-4 p-3">
                  <label htmlFor="existingQuote">{t('frontend.quote.existingQuote')}</label>
                  <SwSelect
                    id="existingQuote"
                    value={existingQuoteVal}
                    onChange={e => {
                      setExistingQuoteVal(e.target.value)
                    }}
                    options={existingQuotes.length > 0 ? existingQuotes : []}
                  />
                  {!existingQuoteVal ? <span className="form-error-msg">{t('frontend.core.required')}</span> : null}
                </div>
                <div className="form-group p-3">
                  <Button
                    isLoading={isLoadingForExisitingQuote}
                    classList="btn btn-primary btn-block mt-4"
                    type="button"
                    onClick={() => {
                      if (!!existingQuoteVal) setExistingQuoteVal(existingQuoteVal)
                      if (!existingQuoteVal) return null
                      setLoadingForExistingQuote(true)
                      const payload = { skuID: sku.skuID, orderID: existingQuoteVal }
                      dispatch(addToOrder({ params: payload, returnQuote: true})).then(response => {
                        if (response.isSuccess() && Object.keys(response.success()?.errors || {}).length) {
                          toast.error(getErrorMessage(response.success().errors))
                        } else {
                          if (response.isSuccess()) {
                            setExistingQuoteVal(existingQuotes?.at(0)['orderID'])
                            setQuoteModal(false)
                            setLoadingForExistingQuote(false)
                            toast.success(t('frontend.quote.exisiting.successMessage'))
                          }
                        }
                      })
                    }}
                    disabled={isLoadingForExisitingQuote}
                  >
                    <span className="d-none d-sm-inline">{t('frontend.quote.addToExistingQuote')}</span>
                  </Button>
                </div>
              </div>
            </div>
          </form>

          <hr className="hr-text" data-content={t('frontend.account.order.template.detail.toolbar.scheduleDateModal.orText')} />
        </>
      )}

      <form name="add-quote">
        <div className="row text-align-center">
          <div className="col-md-12 d-flex justify-content-center">
            <div className="form-group me-3">
              <label htmlFor="quoteName">{t('frontend.quote.label')}</label>
              <input
                className="form-control"
                type="text"
                id="quoteName"
                value={quoteName}
                onChange={e => {
                  setQuoteName(e.target.value)
                }}
              />
            </div>
            <div className="form-group">
              <Button
                isLoading={isLoading}
                disabled={isLoading}
                type="button"
                classList="btn btn-primary btn-block mt-4 d-block m-auto"
                onClick={() => {
                  if (!quoteName) return null
                  setLoading(true)
                  dispatch(addToOrder({ params: { quoteName, skuID: sku.skuID }, returnQuote: true, isQuote: true })).then(response => {
                    if (response.isSuccess() && Object.keys(response.success()?.errors || {}).length) {
                      toast.error(getErrorMessage(response.success().errors))
                    } else {
                      if (response.isSuccess()) {
                        setLoading(false)
                        setQuoteModal(false)
                        toast.success(t('frontend.quote.create.successMessage'))
                        setTimeout(() => {
                          history.push('/my-account/quotes')
                        }, 2000)
                      }
                    }
                  })
                }}
              >
                <span className="d-sm-inline">{t('frontend.quote.createButton')}</span>
              </Button>
            </div>
          </div>
        </div>
      </form>
    </>
  )
}
export { AddProductToQuoteModal }
