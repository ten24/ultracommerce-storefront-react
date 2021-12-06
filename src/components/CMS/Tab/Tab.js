import { useState } from 'react'
import { ListItem, ListItemWithImage } from '../..'
import { useUtilities } from '../../../hooks'

const TabHeading = ({ name = '', loc, isActive = false, setActiveTab }) => {
  return (
    <li className="nav-item" role="presentation">
      <button
        className={`nav-link ${isActive ? 'active' : ''}`}
        id={`${name}-tab`}
        data-bs-toggle="tab"
        data-bs-target={`#${name}`}
        type="button"
        role="tab"
        aria-controls={`${name}`}
        aria-selected="true"
        onClick={e => {
          setActiveTab(loc)
          e.preventDefault()
        }}
      >
        {name}
      </button>
    </li>
  )
}

const TabPanel = ({ panel, isActive }) => {
  let { eventHandlerForWSIWYG } = useUtilities()
  const generateChildren = panel.children
    .map(child => {
      if (child.elementType === 'cetListItem') {
        return <ListItem {...child} />
      }
      if (child.elementType === 'cetListItemWithImage') {
        return <ListItemWithImage {...child} />
      }
      return null
    })
    .filter(item => item)
  // if (blockItems.length) {
  //   generateChildren.push(<Blocks blocks={blockItems} />)
  // }
  return (
    <div className={`tab-pane fade ${isActive ? 'show active' : ''}`} id={panel.name} role="tabpanel" aria-labelledby={`${panel.name}-tab`}>
      <div
        className="content-body"
        onClick={eventHandlerForWSIWYG}
        dangerouslySetInnerHTML={{
          __html: panel.contentBody || '',
        }}
      />
      <div className="tab-panel-children">
        {generateChildren.map((child, index) => {
          return (
            <div key={index}>
              {child} {index < generateChildren.length - 1 && <hr />}
            </div>
          )
        })}
      </div>
    </div>
  )
}

const Tabs = ({ headings, panels }) => {
  return (
    <div className="Tabs">
      <ul className="nav nav-tabs nav-justified border-0" id="myTab" role="tablist">
        {headings}
      </ul>
      <div className="tab-content" id="myTabContent">
        {panels}
      </div>
    </div>
  )
}

const SimpleTabs = ({ data }) => {
  const [activeTab, setActiveTab] = useState(0)
  const headings = data.map(({ title, key }, index) => {
    return <TabHeading name={title} key={index} isActive={activeTab === index} setActiveTab={setActiveTab} loc={index} />
  })
  const panels = data.map((tab, index) => {
    return <TabPanel key={index} panel={tab} isActive={activeTab === index} />
  })
  return <Tabs headings={headings} panels={panels} />
}

export { TabHeading, TabPanel, SimpleTabs, Tabs }
