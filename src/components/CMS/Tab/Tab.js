import { useState } from 'react'
import { useUtilities } from '../../../hooks'

const TabHeading = ({ name = '', loc, isActive = false, setActiveTab }) => {
  return (
    <li className="nav-item" role="presentation">
      <button
        className={`nav-link ${isActive ? 'active' : ''}`}
        id={`${name?.replace(/\s/g, '')}-tab`}
        data-bs-toggle="tab"
        data-bs-target={`#${name?.replace(/\s/g, '')}`}
        type="button"
        role="tab"
        aria-controls={`${name?.replace(/\s/g, '')}`}
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

const TabPanel = props => {
  const { title, contentBody, isActive, children } = props
  let { eventHandlerForWSIWYG } = useUtilities()
  return (
    <div className={`tab-pane fade ${isActive ? 'show active' : ''}`} id={title?.replace(/\s/g, '')} role="tabpanel" aria-labelledby={`${title?.replace(/\s/g, '')}-tab`}>
      <div
        className="content-body"
        onClick={eventHandlerForWSIWYG}
        dangerouslySetInnerHTML={{
          __html: contentBody || '',
        }}
      />
      <div className="tab-panel-children">{children}</div>
    </div>
  )
}

const Tabs = ({ headings, panels }) => {
  return (
    <div className="Tabs shadow">
      <ul className="nav nav-tabs nav-justified border-0" id="myTab" role="tablist">
        {headings}
      </ul>
      <div className="tab-content p-2 p-md-5" id="myTabContent">
        {panels}
      </div>
    </div>
  )
}

const SimpleTabs = props => {
  const { children } = props
  const [activeTab, setActiveTab] = useState(0)
  const headings = children?.map((childTab, index) => {
    return <TabHeading name={childTab.props.el.title} key={index} isActive={activeTab === index} setActiveTab={setActiveTab} loc={index} />
  })
  // I feel weird about this but I think it is okay...
  if (!!children?.at(activeTab)?.props?.el) {
    children.at(activeTab).props.el.isActive = true
  }

  return (
    <div className="Tabs shadow">
      <ul className="nav nav-tabs nav-justified border-0" id="myTab" role="tablist">
        {headings}
      </ul>
      <div className="tab-content p-2 p-md-5" id="myTabContent">
        {children}
      </div>
    </div>
  )
  // return null
}

export { TabHeading, TabPanel, SimpleTabs, Tabs }
