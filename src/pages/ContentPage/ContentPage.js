import { useSelector } from 'react-redux'
import { Layout } from '../../components'
import { createElement } from 'react'
import { useLocation } from 'react-router-dom'
import NotFound from '../NotFound/NotFound'
import BasicPageWithSidebar from '../BasicPageWithSidebar/BasicPageWithSidebar'
import BasicPage from '../BasicPage/BasicPage'

const pageComponents = {
  BasicPageWithSidebar,
  BasicPage,
  NotFound,
  default: BasicPage,
}

const ContentPage = () => {
  let loc = useLocation()
  const path = loc.pathname.split('/').reverse()?.at(0).toLowerCase()
  const content = useSelector(state => state.content)
  let component = 'NotFound'
  if (!content.isFetching && content[path] && content[path]?.contentPageType) {
    component = content[path].contentPageType
  }
  if (content.isFetching) {
    component = 'BasicPage'
  }
  return <Layout>{!content.isFetching && createElement(pageComponents[component])}</Layout>
}

export default ContentPage
