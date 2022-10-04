import React, { useRef, useEffect } from 'react'
import { Wrapper } from '@googlemaps/react-wrapper'

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
const GoogleMap = ({ lat, lng }) => {
  return (
    <div className="container-fluid">
      <div className="row">
        <Wrapper apiKey={process.env.REACT_APP_MAP_API}>
          <InternalMap center={{ lat, lng }} zoom={15} />
        </Wrapper>
      </div>
    </div>
  )
}

export { GoogleMap }
