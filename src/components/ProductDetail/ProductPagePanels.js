import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { isBoolean, booleanToString } from '../../utils'

const ProductPagePanels = ({ product = {}, attributeSets = [] }) => {
  const { t } = useTranslation()

  const filteredAttributeSets = attributeSets
    .map(set => {
      return {
        ...set,
        attributes: set.attributes.filter(attr => attr.attributeCode in product && product[attr.attributeCode].trim().length > 0).sort((a, b) => a.sortOrder - b.sortOrder),
      }
    })
    .filter(set => set.attributes.length)

  return (
    <>
      <div className="accordion" id="productPanelAccordion">
        {filteredAttributeSets.map(set => {
          return (
            <div key={set.attributeSetCode} className="accordion-item">
              <h2 className="accordion-header" id={set.attributeSetCode}>
                <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target={`#panel${set.attributeSetCode}`} aria-expanded="true" aria-controls={`panel${set.attributeSetCode}`}>
                  {set.attributeSetName}
                </button>
              </h2>
              <div id={`panel${set.attributeSetCode}`} className="accordion-collapse collapse show" aria-labelledby={set.attributeSetCode}>
                <div className="accordion-body">
                  <div className="row" style={{ fontSize: 15, letterSpacing: 0.3 }}>
                    {set?.attributes?.map(({ attributeName, attributeCode }, index) => {
                      if (!isBoolean(product[attributeCode]) && product[attributeCode]?.trim()?.length === 0) return null
                      return (
                        <div key={attributeCode} className="col-6">
                          <div className="row">
                            <div className="col-6">{attributeName}</div>
                            <div className="col-6 text-muted" dangerouslySetInnerHTML={{ __html: isBoolean(product[attributeCode]) ? booleanToString(product[attributeCode]) : product[attributeCode] }} />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>
          )
        })}

        <div className="accordion-item">
          <h2 className="accordion-header" id="questions">
            <button className="accordion-button " type="button" data-bs-toggle="collapse" data-bs-target="#questionspanel" aria-expanded="true" aria-controls="questionspanel">
              {t('frontend.product.questions.heading')}
            </button>
          </h2>
          <div id="questionspanel" className="accordion-collapse collapse show" aria-labelledby="questions">
            <div className="accordion-body">
              <p>{t('frontend.product.questions.detail')}</p>
              <Link to="/contact">{t('frontend.nav.contact')}</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export { ProductPagePanels }
