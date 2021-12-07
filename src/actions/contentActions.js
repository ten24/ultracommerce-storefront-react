import { requestContent, receiveContent } from '@slatwall/slatwall-storefront-react/actions'
import { SlatwallCMSService } from '@slatwall/slatwall-storefront-react/services'

export const getPageContent = (content = {}, slug = '') => {
  return async (dispatch, getState) => {
    if (getState().content[slug] || slug === 'product' || slug === 'blog') {
      return
    }
    dispatch(requestContent())
    const { cmsProvider } = getState().configuration
    if (cmsProvider === 'slatwallCMS') {
      const payload = { 'f:activeFlag': true, 'p:show': 250, includeImages: true, includeSettings: true, ...content }
      SlatwallCMSService.getEntryBySlug(payload, slug).then(response => {
        dispatch(receiveContent(response))
      })
    } else if (cmsProvider === 'myCustomCMSLogic') {
      // TODO: My Custom CMS Logic
    }
  }
}

export const getContentByType = (content = {}, type = 'page', slug = '') => {
  return async (dispatch, getState) => {
    if (getState().content[slug]) {
      return
    }
    dispatch(requestContent())
    const { cmsProvider } = getState().configuration
    if (cmsProvider === 'slatwallCMS') {
      const payload = { 'f:activeFlag': true, 'p:show': 250, ...content }
      SlatwallCMSService.getEntryBySlugAndType(payload, slug, type).then(response => {
        dispatch(receiveContent(response))
      })
    } else if (cmsProvider === 'myCustomCMSLogic') {
      // TODO: My Custom CMS Logic
    }
  }
}
