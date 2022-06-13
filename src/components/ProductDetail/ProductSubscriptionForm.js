import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { sdkURL, axios } from '../../services'
import { addToCart } from '../../actions'
import { useProductPrice } from '../../hooks'
import { Button, ProductQuantityInput } from '../'
import { checkInvetory } from '../../selectors'
import { useOrderTemplateList } from '../../hooks/'
import { Modal, AddProductToSubscriptionModal } from '..'

const ProductQuantityMessage = () => {
  const { t } = useTranslation()
  return (
    <div style={{ marginRight: '5px' }}>
      <span className="text-accent"> {t('frontend.checkout.stock')}</span>
    </div>
  )
}

const ProductSubscriptionForm = ({ sku, productType }) => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const checkInvetoryFlag = useSelector(checkInvetory)
  const { showAddToCart } = useProductPrice({ salePrice: sku?.salePrice, listPrice: sku?.listPrice })
  const [quantity, setQuantity] = useState(1)
  const [showAddToSubscriptionModal, setAddToSubscriptionModal] = useState(false)
  const [frequencyTermOptions, setfrequencyTermOptions] = useState([])
  const { orderTemplates } = useOrderTemplateList({ statusFilter: 'otstActive' })
  const [isLoading, setLoading] = useState(false)
  useEffect(() => {
    axios({
      method: 'GET',
      withCredentials: true,
      url: `${sdkURL}api/scope/getFrequencyTermOptions`,
      data: {},
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(response => {
      if (response.status === 200) {
        if (response?.data?.frequencyTermOptions?.length > 0) {
          setfrequencyTermOptions(response.data.frequencyTermOptions.map(({ name, value }) => ({ key: name, value: value })))
        }
      }
    })
  }, [])
  if (checkInvetoryFlag && (!sku || sku?.calculatedQATS < 1 || sku?.stocks_calculatedQATS < 1)) return <ProductQuantityMessage />
  return (
    <div className=" ">
      <form
        className="d-lg-flex d-sm-block align-items-end "
        onSubmit={event => {
          event.preventDefault()
        }}
      >
        {showAddToCart && (
          <>
            <div className="form-group me-2 mb-4">
              <ProductQuantityInput setQuantity={setQuantity} quantity={quantity} sku={sku} stock={sku.calculatedQATS || sku.stocks_calculatedQATS} />
            </div>
            <div className="form-group me-2 mb-4">
              {productType === '1' && (
                <Button
                  disabled={isLoading}
                  isLoading={isLoading}
                  classList="btn btn-primary btn-block my-3 mb-3"
                  label={t('frontend.product.add_to_cart')}
                  onClick={event => {
                    event.preventDefault()
                    setLoading(true)
                    dispatch(addToCart(sku.skuID, quantity)).then(() => {
                      window.scrollTo({
                        top: 0,
                        behavior: 'smooth',
                      })
                      setLoading(false)
                    })
                  }}
                />
              )}
              {productType === '2' && (
                <Button
                  disabled={isLoading}
                  isLoading={isLoading}
                  classList="btn btn-primary btn-block my-3 mb-3 p-2"
                  label={t('frontend.product.addToSubscription')}
                  onClick={event => {
                    event.preventDefault()
                    setAddToSubscriptionModal(!showAddToSubscriptionModal)
                  }}
                />
              )}
            </div>
          </>
        )}
      </form>
      <Modal show={showAddToSubscriptionModal} setShow={setAddToSubscriptionModal} title={t('frontend.product.subscriptionModal.heading')} size="xLarge">
        <div className="container">{frequencyTermOptions.length > 0 && <AddProductToSubscriptionModal show={showAddToSubscriptionModal} orderTemplates={orderTemplates} setShow={setAddToSubscriptionModal} frequencyTermOptions={frequencyTermOptions} sku={sku} quantity={quantity} />}</div>
      </Modal>
    </div>
  )
}
export { ProductSubscriptionForm }
