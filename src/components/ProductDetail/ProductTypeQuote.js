import { AddProductToQuoteModal } from '../../components'
import { useTranslation } from 'react-i18next'
import { useState } from 'react'
import { Button, Modal } from '../'
import { toBoolean,isAuthenticated } from '../../utils'

const ProductTypeQuote = ({ selectedSKu, product, isFetching, quantity }) => {
  
  const { t } = useTranslation()
  const [quoteModal, setQuoteModal] = useState(false)
  
  return (
    <>
      {isAuthenticated() &&  toBoolean(selectedSKu?.settings?.skuAllowQuoteFlag) && (
      <>
       <div className="d-flex d-flex align-items-end ">
        <form
          className="d-flex align-items-end "
          onSubmit={event => {
            event.preventDefault()
          }}
        >
            <div className="form-group me-2 mb-4">
              <Button
                disabled={isFetching ? true : false}
                isLoading={isFetching}
                className="btn btn-primary btn-block my-3"
                label={t('frontend.quote.addToQuote')}
                onClick={event => {
                  event.preventDefault()
                  setQuoteModal(!quoteModal)
                }}
              />
            </div>
        </form>
      </div>
      <Modal show={quoteModal} setShow={setQuoteModal} title={t('frontend.quote.addToQuote')} size="large">
        <div className="container">{quoteModal && <AddProductToQuoteModal sku={selectedSKu} show={quoteModal} setQuoteModal={setQuoteModal} quantity={quantity} />}</div>
      </Modal>
     </>
      )}
    </>
  )
}
export { ProductTypeQuote }
