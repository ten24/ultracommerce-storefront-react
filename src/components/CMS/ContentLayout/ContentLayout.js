import { ContentLayoutCSSGrid, ContentLayoutCardGrid, ContentLayoutCardGroup, ContentLayoutCardMasontry } from './ContentLayoutTypes'
const ContentLayout = props => {
  const { layoutViewMode = 'css-grid', ...rest } = props

  if (layoutViewMode === 'css-grid') return <ContentLayoutCSSGrid {...rest} />
  if (layoutViewMode === 'card-grid') return <ContentLayoutCardGrid {...rest} />
  if (layoutViewMode === 'card-group') return <ContentLayoutCardGroup {...rest} />
  if (layoutViewMode === 'card-masonry') return <ContentLayoutCardMasontry {...rest} />

  return null
}

export { ContentLayout }
