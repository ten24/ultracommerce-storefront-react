import { useTranslation } from 'react-i18next'
import { ProductPagePanels } from './ProductPagePanels'

const ProductAttributes = ({ product = {}, attributeSets = [] }) => {
  const { t } = useTranslation()
  return (
    <div className="col">
      <h5 className="modal-title">{t('frontend.product.attributes')}</h5>
      <hr />
      <ProductPagePanels product={product} attributeSets={attributeSets} />
    </div>
  )
}

export { ProductAttributes }
