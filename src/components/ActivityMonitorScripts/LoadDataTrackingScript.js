import { sdkURL, axios } from '../../services'
import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'

const dataTrackingScriptID = 'activityMonitor'

export const LoadDataTrackingScript = () => {
  const [dataTrackingUrl, setDataTrackingUrl] = useState('')

  //call API, TODO: move this to SDK
  useEffect(() => {
    //check if script tag already exists
    const existingScript = document.getElementById(dataTrackingScriptID)
    if (!existingScript) {
      axios({
        method: 'POST',
        withCredentials: true,
        url: `${sdkURL}api/scope/getFraudCheckDataTrackingUrl`,
        headers: {
          'Content-Type': 'application/json',
        },
      }).then(response => {
        if (response?.status === 200 && response?.data?.data?.dataTrackingUrl !== '' && response?.data?.data?.dataTrackingUrl !== undefined) {
          setDataTrackingUrl(response.data.data.dataTrackingUrl)
        }
      })
    }
  }, [])

  return (
    <>
      <Helmet>{dataTrackingUrl !== '' && <script id={dataTrackingScriptID} async="true" src={dataTrackingUrl}></script>}</Helmet>
    </>
  )
}
