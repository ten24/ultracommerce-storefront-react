import { toast } from 'react-toastify'
import { SlatwalApiService, KontentService, ContentfulService, SlatwallCMSService, sdkURL, axios } from '../services'
import { getErrorMessage } from '../utils'

import { setTitle } from './configActions'

export const REQUEST_CONTENT = 'REQUEST_CONTENT'
export const RECEIVE_CONTENT = 'RECEIVE_CONTENT'
export const RECEIVE_COUNTRIES = 'RECEIVE_COUNTRIES'
export const RECEIVE_STATE_CODES = 'RECEIVE_STATE_CODES'
export const REQUEST_CONTENT_SILENTLY = 'REQUEST_CONTENT_SILENTLY'
export const RECEIVE_CONTENT_SILENTLY = 'RECEIVE_CONTENT_SILENTLY'
export const EVICT_ALL_PAGES = 'EVICT_ALL_PAGES'

export const requestContent = () => {
  return {
    type: REQUEST_CONTENT,
  }
}
export const requestContentSiltently = () => {
  return {
    type: REQUEST_CONTENT_SILENTLY,
  }
}
export const receiveContentSiltently = content => {
  return {
    type: RECEIVE_CONTENT_SILENTLY,
    content,
  }
}
export const receiveContent = content => {
  return {
    type: RECEIVE_CONTENT,
    content,
  }
}
export const receiveStateCodes = codes => {
  return {
    type: RECEIVE_STATE_CODES,
    payload: codes,
  }
}

export const receiveCountries = countries => {
  return {
    type: RECEIVE_COUNTRIES,
    payload: countries,
  }
}
export const evictAllPages = () => {
  return {
    type: EVICT_ALL_PAGES,
  }
}
export const getPageContent = (content = {}, slug = '') => {
  return async (dispatch, getState) => {
    if (getState().content[slug] || slug === 'product' || slug === 'blog' || slug === 'articles') {
      return new Promise((resolve, reject) => resolve({}))
    }
    dispatch(requestContent())
    const { cmsProvider } = getState().configuration
    if (cmsProvider === 'slatwallCMS') {
      const payload = { 'f:activeFlag': true, 'p:show': 250, includeImages: true, includeSettings: true, ...content }
      SlatwallCMSService.getEntryBySlug(payload, slug).then(({ hydrated }) => {
        dispatch(receiveContent({ hydrated }))
        return hydrated
      })
    } else if (cmsProvider === 'contentful') {
      ContentfulService.getEntryBySlugAndType(content, slug, 'page')
        .then(data => {
          if (Array.isArray(data)) {
            if (data.length) {
              data.forEach(object => {
                dispatch(receiveContent(object))
              })
            } else {
              dispatch(receiveContent())
            }
          } else {
            dispatch(receiveContent(data))
          }
          return data
        })
        .catch(thrown => {})
    } else if (cmsProvider === 'kontent') {
      KontentService.getEntryBySlug(content, slug)
        .then(data => {
          if (Array.isArray(data)) {
            data.forEach(object => {
              dispatch(receiveContent(object))
            })
          } else {
            dispatch(receiveContent(data))
          }
          return data
        })
        .catch(thrown => {})
    }
    return new Promise((resolve, reject) => resolve({}))
  }
}

export const getContentByType = (content = {}, type = 'page', slug = '') => {
  return async (dispatch, getState) => {
    if (getState().content[slug]) {
      return new Promise((resolve, reject) => resolve({}))
    }
    if (type === 'page') dispatch(requestContent())
    const { cmsProvider } = getState().configuration
    if (cmsProvider === 'slatwallCMS') {
      const payload = { 'f:activeFlag': true, 'p:show': 250, ...content }
      SlatwallCMSService.getEntryBySlugAndType(payload, slug, type).then(({ hydrated }) => {
        if (type === 'page') dispatch(receiveContent(hydrated))
        if (type !== 'page') dispatch(receiveContentSiltently(hydrated))
        return hydrated
      })
    } else if (cmsProvider === 'contentful') {
      ContentfulService.getEntryBySlugAndType(content, slug, type)
        .then(data => {
          if (Array.isArray(data)) {
            data.forEach(object => {
              if (type === 'page') dispatch(receiveContent(object))
              if (type !== 'page') dispatch(receiveContentSiltently(object))
            })
          } else {
            if (type === 'page') dispatch(receiveContent(data))
            if (type !== 'page') dispatch(receiveContentSiltently(data))
          }
          return data
        })
        .catch(thrown => {})
    } else if (cmsProvider === 'kontent') {
      KontentService.getEntryBySlugAndType(content, slug, type)
        .then(data => {
          if (Array.isArray(data)) {
            data.forEach(object => {
              if (type === 'page') dispatch(receiveContent(object))
              if (type !== 'page') dispatch(receiveContentSiltently(object))
            })
          } else {
            if (type === 'page') dispatch(receiveContent(data))
            if (type !== 'page') dispatch(receiveContentSiltently(data))
          }
          return data
        })
        .catch(thrown => {})
    }
    return new Promise((resolve, reject) => resolve({}))
  }
}

export const getStateCodeOptionsByCountryCode = (countryCode = 'US') => {
  return async dispatch => {
    dispatch(requestContent())
    return await SlatwalApiService.location.states({ countryCode }).then(response => {
      if (response.isSuccess() && Object.keys(response.success()?.errors || {}).length) toast.error(getErrorMessage(response.success().errors))
      if (response.isSuccess()) {
        let responsePayload = {}
        responsePayload[countryCode] = response.success().stateCodeOptions || []
        dispatch(receiveStateCodes(responsePayload))
      } else {
        dispatch(receiveStateCodes({}))
      }
      return response
    })
  }
}

export const getCountriesAndAddressOptions = () => {
  return async dispatch => {
    dispatch(requestContent())
    return await axios({
      method: 'GET',
      withCredentials: true,
      url: `${sdkURL}api/scope/getCountriesAndAddressOptions`,
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(response => {
      const countries = response?.data?.countries?.reduce((countryList, country) => {
        country.value = country.value.toUpperCase()
        countryList[country.value] = country
        return countryList
      }, {})
      dispatch(receiveCountries(countries))
      return response
    })
  }
}
export const getCountries = () => {
  return async dispatch => {
    dispatch(requestContent())

    return await SlatwalApiService.location.countries().then(response => {
      if (response.isSuccess() && Object.keys(response.success()?.errors || {}).length) toast.error(getErrorMessage(response.success().errors))
      if (response.isSuccess()) {
        dispatch(receiveContent({ countryCodeOptions: response.success().countryCodeOptions }))
      } else {
        dispatch(receiveContent({}))
      }
      return response
    })
  }
}
export const addContent = (content = {}) => {
  return async dispatch => {
    if (content.settings) {
      dispatch(setTitle(content.settings.contentHTMLTitleString))
    }
    dispatch(receiveContent(content))
    return new Promise((resolve, reject) => resolve({}))
  }
}
export const getProductTypes = () => {
  return async dispatch => {
    dispatch(requestContent())
    return await SlatwalApiService.productType.list({ 'p:show': 500 }).then(response => {
      if (response.isSuccess() && Object.keys(response.success()?.errors || {}).length) toast.error(getErrorMessage(response.success().errors))
      if (response.isSuccess()) {
        dispatch(receiveContent({ productTypes: response.success().data.pageRecords }))
      } else {
        dispatch(receiveContent({}))
      }
      return response
    })
  }
}
