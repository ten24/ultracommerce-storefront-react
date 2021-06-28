import { toast } from 'react-toastify'
import { SlatwalApiService } from '../services'
import { getEntryBySlug } from '../services/ContentfulService'
import { getErrorMessage } from '../utils'

import { setTitle } from './configActions'

export const REQUEST_CONTENT = 'REQUEST_CONTENT'
export const RECEIVE_CONTENT = 'RECEIVE_CONTENT'
export const RECEIVE_STATE_CODES = 'RECEIVE_STATE_CODES'

export const requestContent = () => {
  return {
    type: REQUEST_CONTENT,
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

export const getPageContent = (content = {}, slug = '') => {
  return async (dispatch, getState) => {
    if (getState().content[slug]) {
      return
    }
    dispatch(requestContent())
    const { cmsProvider } = getState().configuration
    if (cmsProvider === 'slatwallCMS') {
      const payload = { 'f:activeFlag': true, 'p:show': 250, ...content }
      await SlatwalApiService.content.get(payload).then(response => {
        if (response.isSuccess() && Object.keys(response.success()?.errors || {}).length) toast.error(getErrorMessage(response.success().errors))
        if (response.isSuccess()) {
          const data = response.success().data.pageRecords.reduce((accumulator, content) => {
            accumulator[content.urlTitlePath] = content
            return accumulator
          }, {})
          dispatch(receiveContent(data))
        } else {
          dispatch(receiveContent({}))
        }
      })
    } else if (cmsProvider === 'contentful') {
      getEntryBySlug(content, slug)
        .then(data => {
          if (Array.isArray(data)) {
            data.forEach(object => {
              dispatch(receiveContent(object))
            })
          } else {
            dispatch(receiveContent(data))
          }
        })
        .catch(thrown => {})
    }
  }
}

export const getStateCodeOptionsByCountryCode = (countryCode = 'US') => {
  return async dispatch => {
    dispatch(requestContent())
    const payload = {}
    await SlatwalApiService.location.states(payload).then(response => {
      if (response.isSuccess() && Object.keys(response.success()?.errors || {}).length) toast.error(getErrorMessage(response.success().errors))
      if (response.isSuccess()) {
        let responsePayload = {}
        responsePayload[countryCode] = response.success().stateCodeOptions || []
        dispatch(receiveStateCodes(responsePayload))
      } else {
        dispatch(receiveStateCodes({}))
      }
    })
  }
}
export const getCountries = () => {
  return async dispatch => {
    dispatch(requestContent())

    await SlatwalApiService.location.countries().then(response => {
      if (response.isSuccess() && Object.keys(response.success()?.errors || {}).length) toast.error(getErrorMessage(response.success().errors))
      if (response.isSuccess()) {
        dispatch(receiveContent({ countryCodeOptions: response.success().countryCodeOptions }))
      } else {
        dispatch(receiveContent({}))
      }
    })
  }
}
export const addContent = (content = {}) => {
  return async dispatch => {
    if (content.settings) {
      dispatch(setTitle(content.settings.contentHTMLTitleString))
    }
    dispatch(receiveContent(content))
  }
}
export const getProductTypes = () => {
  return async dispatch => {
    dispatch(requestContent())
    const payload = { 'p:show': 500 }

    await SlatwalApiService.productType.list(payload).then(response => {
      if (response.isSuccess() && Object.keys(response.success()?.errors || {}).length) toast.error(getErrorMessage(response.success().errors))
      if (response.isSuccess()) {
        dispatch(receiveContent({ productTypes: response.success().data.pageRecords }))
      } else {
        dispatch(receiveContent({}))
      }
    })
  }
}
