import React, { useRef, useEffect } from 'react'
import { Wrapper } from '@googlemaps/react-wrapper'
import { useSelector } from 'react-redux'
import { getSiteSetting } from '../../selectors/'

// https://www.npmjs.com/package/@googlemaps/react-wrapper

// const render = status => {
//   switch (status) {
//     case Status.LOADING:
//       return <Spinner />
//     case Status.FAILURE:
//       return <ErrorComponent />
//     case Status.SUCCESS:
//       return <MyMapComponent />
//   }
// }

function InternalMap({ center, zoom }) {
  const ref = useRef()

  useEffect(() => {
    const map = new window.google.maps.Map(ref.current, {
      center,
      zoom,
    })

    new window.google.maps.Marker({
      position: center,
      map: map,
    })
  })

  return <div ref={ref} style={{ height: '15em', width: '100%' }} id="map" />
}
const GoogleMap = props => {
  const settings = useSelector(getSiteSetting)
  console.log('props', props)
  const { centerLatitude, centerLongitude, mapZoom } = props
  if (!settings?.siteStorefrontConfig?.siteGoogleMapKey) return null
  return (
    <div className="container-fluid">
      <div className="row">
        <Wrapper apiKey={settings?.siteStorefrontConfig?.siteGoogleMapKey}>
          <InternalMap center={{ lat: parseFloat(centerLatitude), lng: parseFloat(centerLongitude) }} zoom={parseInt(mapZoom)} />
        </Wrapper>
      </div>
    </div>
  )
}

export { GoogleMap }
