import { REQUEST_CONTENT, RECEIVE_CONTENT, RECEIVE_STATE_CODES } from '../actions/contentActions'

const initState = {
  countryCodeOptions: [],
  stateCodeOptions: {},
  isFetching: false,
  sliderData: [],
  latestNews: [],
  aboutContent: [],
  blogList: [],
  blogPostData: {},
  recentBlogPost: {},
  blogPostList: [],
  'header/main-navigation': {},
  'home/main-banner-sliders': {},
  'home/recentBlogPost': {},
  'blog/blog-post-list': {},
  'home/popularProducts': {},
}

const content = (state = initState, action) => {
  switch (action.type) {
    case REQUEST_CONTENT:
      return { ...state, isFetching: true }

    case RECEIVE_CONTENT:
      const { content } = action
      return { ...state, ...content, isFetching: false }
    case RECEIVE_STATE_CODES:
      return { ...state, stateCodeOptions: { ...state.stateCodeOptions, ...action.payload }, isFetching: false }

    default:
      return state
  }
}

export default content
