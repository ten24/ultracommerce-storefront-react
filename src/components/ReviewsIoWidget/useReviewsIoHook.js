import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import { useGetAllOrders } from '../../hooks'

const useReviewsIoHook = ( { optionsConfig, props, widgetType = "list"} ) => {
    const [loaded, setLoaded] = useState(false)
    //get widget options from content element
    let { cetReviewsioScript, cetReviewsioStyles, contentElementID } = props
    //updated config passed from parent component
    //we can reset storeID, and add SKU filters
    let cetReviewsioOptionsObject = optionsConfig

    //const reviewsComponentID = `reviewsIoComponent-${contentElementID}`
    const scriptElementID = `reviewsIoWidgetLib-${contentElementID}`
    const htmlElementID = `reviewsio-carousel-widget-${contentElementID}`
    const widgetScriptID = `reviewsIoWidgetScript-${contentElementID}`
    const widgetScriptSnippet = widgetType === "list" ? "new carouselInlineWidget" : "writeReviewWidget"

    let [orders, setRequest ] = useGetAllOrders()
    
    useEffect( () => {
        //by default review will be posted for latest order on account
       //TOOD: change this behaviour to get driven from order confirmation, somthing similar we did for products, may be use a different context
        if( widgetType === "write" ) {
            let didCancel = false

            if (!orders.isFetching && !orders.isLoaded && !didCancel) {
                setRequest({ ...orders, isFetching: true, isLoaded: false, params: { pageRecordsShow: 1, currentPage: 1 }, makeRequest: true })
            }
            return () => {
                didCancel = true
            }
        }
    }, [ orders, setRequest, widgetType ])

    useEffect(() => {
        if( widgetType === "list" || ( widgetType === "write" && orders.isLoaded && orders.data.ordersOnAccount?.at(0) ) ) {
            /** Populate Order Options For Write Review */
            if( widgetType === "write" ) {
                cetReviewsioOptionsObject.order_id = orders.data.ordersOnAccount?.at(0)?.orderNumber
            }
            /** Load widget script manually - so we can tap on load event */
            const script = document.createElement('script')
            script.src = cetReviewsioScript
            script.id = scriptElementID
            script.async = true
            document.body.appendChild(script)
            script.onload = () => {
            //call javascript method to initialize library
            let newScript = document.createElement('script')
            let inlineScript = document.createTextNode(widgetScriptSnippet + '("'+htmlElementID+'", '+ JSON.stringify(cetReviewsioOptionsObject) + '); ')
            newScript.setAttribute('id', widgetScriptID )
            newScript.appendChild(inlineScript)
            document.getElementsByTagName('head')[0].appendChild(newScript)
    
            //set loaded state to true
            setLoaded(true)
            }
        }
  
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [orders])

    return (
        <>
          <Helmet>
            {
                /** Load Styles */
                cetReviewsioStyles.split(",").map( item => {
                    return <link rel="stylesheet" key={"widgetStyle-" + contentElementID } href={ item.trim() } />
                })
            }
          </Helmet>
          {loaded && <div id={ htmlElementID } className="px-5" />}
        </>
      )
  }

export default useReviewsIoHook;