import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { isBoolean, booleanToString } from '../../utils'

const propertyBlackList = ['productID', 'productName', 'productCode', 'productFeatured', 'productDisplay']

// TODO: Migrate to reactstrap accordion
const ProductPagePanels = ({ product = {}, attributeSets = [] }) => {
  const { t } = useTranslation()

  const filteredAttributeSets = attributeSets
    .map(set => {
      return { ...set, attributes: set.attributes.filter(attr => attr.attributeCode in product && !propertyBlackList.includes(attr.attributeCode) && product[attr.attributeCode] !== ' ').sort((a, b) => a.sortOrder - b.sortOrder) }
    })
    .filter(set => set.attributes.length)

  return (
    <div className="accordion mb-4" id="productPanels">
      {filteredAttributeSets.map(set => {
        return (
          <div className="card" key={set.attributeSetCode}>
            <div className="card-header accordion-item">
              <h4 className="accordion-heading">
                <Link to={`#${set.attributeSetCode}`} role="button" data-bs-toggle="collapse" data-bs-target={set.attributeSetCode} aria-expanded="true" aria-controls={set.attributeSetCode}>
                  <i className="far fa-key font-size-lg align-middle mt-n1 mr-2"></i>
                  {set.attributeSetName}
                  <span className="accordion-indicator"></span>
                </Link>
              </h4>
            </div>
            <div className="accordion-collapse collapse show" id={set.attributeSetCode} data-parent="#productPanels">
              <div className="card-body font-size-sm">
                {set.attributes.map(({ attributeName, attributeCode }) => {
                  return (
                    <div className="font-size-sm row" key={attributeName}>
                      <div className="col-6">
                        <ul className="m-0 p-0">{attributeName}</ul>
                      </div>
                      <div className="col-6 text-muted">
                        <ul className="m-0 p-0">{isBoolean(product[attributeCode]) ? booleanToString(product[attributeCode]) : product[attributeCode]}</ul>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )
      })}
      <div className="card accordion">
        <div className="card-header accordion-item">
          <h5 className="accordion-heading">
            <Link className="collapsed nav-link" to="#questions" role="button" data-bs-toggle="collapse" data-bs-target="#questions" aria-controls="questions" data-toggle="collapse" aria-expanded="true">
              <i className="bi bi-question-circle font-size-lg align-middle mt-n1 me-2"></i>
              {t('frontend.product.questions.heading')}
              <span className="accordion-indicator"></span>
            </Link>
          </h5>
        </div>
        <div className="accordion-collapse collapse show" id="questions" data-parent="#productPanels">
          <div className="card-body">
            <p>{t('frontend.product.questions.detail')}</p>
            <Link to="/contact">{t('frontend.nav.contact')}</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export { ProductPagePanels }
