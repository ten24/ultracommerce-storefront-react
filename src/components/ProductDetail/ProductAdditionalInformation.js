import { useTranslation } from 'react-i18next'

const ProductAdditionalInformation = ({ additionalInformation }) => {
  const { t } = useTranslation()
  if (!additionalInformation) return null
  return (
    <div className="product-info my-5">
      <h2 className="h4">{t('frontend.product.additionalInformation')}</h2>
      <div
        className="pt-1"
        dangerouslySetInnerHTML={{
          __html: additionalInformation,
        }}
      />
    </div>
  )
}
export { ProductAdditionalInformation }
