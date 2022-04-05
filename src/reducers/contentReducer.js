import { REQUEST_CONTENT, RECEIVE_CONTENT, RECEIVE_STATE_CODES, RECEIVE_CONTENT_SILENTLY, REQUEST_CONTENT_SILENTLY } from '../actions/contentActions'

const initState = {
  productTypes: [],
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
    

      case REQUEST_CONTENT_SILENTLY:
        return { ...state }

      case RECEIVE_CONTENT_SILENTLY:
        return { ...state, ...action.content }

    case RECEIVE_STATE_CODES:
      return { ...state, stateCodeOptions: { ...state.stateCodeOptions, ...action.payload }, isFetching: false }

    default:
      return state
  }
}

export default content
