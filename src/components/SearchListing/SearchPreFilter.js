import { useTranslation } from 'react-i18next'
import { Link, useLocation } from 'react-router-dom'
const SearchPreFilter = ({ params, potentialFilters, requiredFilterSlug, ...props }) => {
  const { t } = useTranslation()
  const loc = useLocation()
  const [filterType, filterKey] = requiredFilterSlug.split('_') //requiredFilterSlug.split('_')
  let facet = {}
  if (['attribute', 'option'].includes(filterType)) {
    facet = potentialFilters[filterType]?.sortedSubFacets.find(facet => facet.subFacetKey === filterKey)
    if (!!facet)
      facet.options = facet.options.map(opt => {
        return { name: opt.name, value: opt.code, slug: opt.name }
      })
  } else {
    facet = potentialFilters[filterType]
  }
  if (requiredFilterSlug in params && params[requiredFilterSlug]?.length) return null // hide if satisfied
  return (
    <div className="my-5">
      <h4 className="text-center">{t('frontend.profiles.preFilterMessage')} </h4>
      <div className="text-center list-style-none ms-0 mt-4">
        {facet?.options.map((option, idx) => {
          return (
            <Link key={idx} to={`${loc.pathname}?${requiredFilterSlug}=` + encodeURIComponent(option.slug)} id={option.slug} className="btn btn-primary me-2">
              {option?.name}
            </Link>
          )
        })}
      </div>
    </div>
  )
}

export { SearchPreFilter }
