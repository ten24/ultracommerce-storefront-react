import { REQUEST_CONTENT, RECEIVE_CONTENT, RECEIVE_STATE_CODES, RECEIVE_CONTENT_SILENTLY, REQUEST_CONTENT_SILENTLY, RECEIVE_COUNTRIES, EVICT_ALL_PAGES } from '../actions/contentActions'

const initState = {
  productTypes: [],
  countries: {},
  countryCodeOptions: [],
  stateCodeOptions: {},
  isFetching: true,
}
// special for header and footer
const content = (state = initState, action) => {
  switch (action.type) {
    case REQUEST_CONTENT:
      return { ...state, isFetching: true }

    case RECEIVE_CONTENT:
      return { ...state, ...action.content, isFetching: false }
    case EVICT_ALL_PAGES: {
      return {
        ...Object.keys(state)
          .filter(key => {
            // console.log(`${key}`, state[key])
            return !state[key]?.isPageFlag || state[key]?.permissions?.nonRestrictedFlag
          })
          .reduce((acc, curr) => {
            acc[curr] = state[curr]
            return acc
          }, {}),
        isFetching: false,
      }
    }

    case REQUEST_CONTENT_SILENTLY:
      return { ...state }

    case RECEIVE_CONTENT_SILENTLY:
      return { ...state, ...action.content }

    case RECEIVE_STATE_CODES:
      return { ...state, stateCodeOptions: { ...state.stateCodeOptions, ...action.payload }, isFetching: false }
    case RECEIVE_COUNTRIES:
      return { ...state, countries: { ...action.payload }, isFetching: false }

    default:
      return state
  }
}

export default content
