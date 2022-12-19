import { SearchListingStack } from '../../components'
import { useListing } from '../../hooks'
import { useState } from 'react'
import { useElementContext } from '../../contexts/ElementContextProvider'

const DefaultSearchListing = props => {
  const { SearchPreFilter } = useElementContext()
  const [preFilter] = useState({})
  const searchListingData = useListing(preFilter, props?.searchConfig)

  return (
    <>
      {/* Show any Prefilters */}
      {!!props?.searchConfig?.requiredPreFilters?.length && (
        <div className="container cetSearchPreFilter">
          {props?.searchConfig.requiredPreFilters.map((filter, idx) => {
            return <SearchPreFilter key={idx} params={searchListingData.params} potentialFilters={searchListingData.potentialFilters} requiredFilterSlug={filter} />
          })}
        </div>
      )}

      {/* Show Listing if Prefilters are met */}
      {!props?.searchConfig?.requiredPreFilters?.map(filter => !(filter in searchListingData.params && searchListingData?.params[filter]?.length))?.filter(f => f)?.length && <SearchListingStack searchListingData={searchListingData} {...props} />}
    </>
  )
}

export { DefaultSearchListing }
