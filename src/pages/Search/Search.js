import { Listing, Layout } from '../../components'
import queryString from 'query-string'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-use'

const Search = () => {
  const loc = useLocation()
  const { t } = useTranslation()
  let params = queryString.parse(loc.search, { arrayFormat: 'separator', arrayFormatSeparator: ',' })
  const title = params['keyword'] ? `${t('frontend.header.search')} - ${params['keyword']}` : `${t('frontend.header.shopStore')}`

  return (
    <Layout>
      <div className="bg-lightgray py-4">
        <div className="container d-lg-flex justify-content-between py-2 py-lg-3">
          <div className="order-lg-1 pr-lg-4 text-center">
            <h1 className="h3 text-dark mb-0 font-accent">{title || ''}</h1>
          </div>
        </div>
      </div>
      <Listing />
    </Layout>
  )
}
export default Search
