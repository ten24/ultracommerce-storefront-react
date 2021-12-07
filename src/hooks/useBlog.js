import { useState, useEffect } from 'react'
import { SlatwallCMSService } from '@slatwall/slatwall-storefront-react/services'
import { useSelector } from 'react-redux'

export const useGetBlogPosts = () => {
  const { cmsProvider } = useSelector(state => state.configuration)
  let [request, setRequest] = useState({ isFetching: false, isLoaded: false, makeRequest: false, data: [], error: '', params: { content_type: 'blog', limit: 3 }, entity: '' })
  useEffect(() => {
    if (request.makeRequest) {
      if (cmsProvider === 'slatwallCMS') {
        SlatwallCMSService.getBlogPosts(request.params)
          .then(response => {
            setRequest({ data: response, isFetching: false, isLoaded: true, makeRequest: false, params: {} })
          })
          .catch(thrown => {})
      } else if (cmsProvider === 'myCustomCMSLogic') {
        // TODO: My Custom CMS Logic
      }
    }
  }, [request, setRequest, cmsProvider])

  return [request, setRequest]
}

export const useGetBlogPost = () => {
  const { cmsProvider } = useSelector(state => state.configuration)
  let [request, setRequest] = useState({ isFetching: false, isLoaded: false, params: { content_type: 'blog', limit: 3 }, makeRequest: false, data: [], error: '', entity: '' })

  useEffect(() => {
    if (request.makeRequest) {
      if (cmsProvider === 'slatwallCMS') {
        SlatwallCMSService.getBlogPostData(request.params)
          .then(response => {
            setRequest({ data: response, isFetching: false, isLoaded: true, makeRequest: false, params: {} })
          })
          .catch(thrown => {})
      } else if (cmsProvider === 'myCustomCMSLogic') {
        // TODO: My Custom CMS Logic
      }
    }
  }, [request, setRequest, cmsProvider])

  return [request, setRequest]
}

// I am sure there is an endpoint to just get categories without getting all the posts
export const useGetBlogCatagories = () => {
  const { cmsProvider } = useSelector(state => state.configuration)
  let [request, setRequest] = useState({ isFetching: false, isLoaded: false, makeRequest: false, data: [], error: '', entity: '' })

  useEffect(() => {
    if (request.makeRequest) {
      if (cmsProvider === 'slatwallCMS') {
        SlatwallCMSService.getBlogCatagories(request.params)
          .then(data => {
            setRequest({ data: data, isFetching: false, isLoaded: true, makeRequest: false, params: {} })
          })
          .catch(thrown => {})
      } else if (cmsProvider === 'myCustomCMSLogic') {
        // TODO: My Custom CMS Logic
      }
    }
  }, [request, setRequest, cmsProvider])

  return [request, setRequest]
}
