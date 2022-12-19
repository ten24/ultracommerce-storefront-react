import { useElementContext } from '../../../contexts/ElementContextProvider'

const ContentCard = props => {
  const { BasicCard, OverlayCard, HorizontalCard } = useElementContext()
  const { contentCardLayout = 'card-basic', ...rest } = props
  if (contentCardLayout === 'card-basic') return <BasicCard imagePosition="top" {...rest} />
  if (contentCardLayout === 'card-basic-image-bottom') return <BasicCard imagePosition="bottom" {...rest} />

  if (contentCardLayout === 'card-overlay-left') return <OverlayCard overlayType="left" {...rest} />
  if (contentCardLayout === 'card-overlay-right') return <OverlayCard overlayType="right" {...rest} />
  if (contentCardLayout === 'card-overlay-heading') return <OverlayCard overlayType="heading" {...rest} />

  if (contentCardLayout === 'card-horizontal-image-left') return <HorizontalCard imagePosition="left" {...rest} />
  if (contentCardLayout === 'card-horizontal-image-right') return <HorizontalCard imagePosition="right" {...rest} />

  return null
}

export { ContentCard }
