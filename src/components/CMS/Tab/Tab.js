import React, { useState } from 'react'
import { useUtilities } from '../../../hooks'

const TabHeading = ({ contentHeading = '', contentElementID, isActive = false, setActiveTab }) => {
  return (
    <li className="nav-item" role="presentation">
      <button
        className={`nav-link ${isActive ? 'active' : ''}`}
        id={`${contentHeading?.replace(/\s/g, '')}-tab`}
        data-bs-toggle="tab"
        data-bs-target={`#${contentHeading?.replace(/\s/g, '')}`}
        type="button"
        role="tab"
        aria-controls={`${contentHeading?.replace(/\s/g, '')}`}
        aria-selected="true"
        onClick={e => {
          setActiveTab(contentElementID)
          e.preventDefault()
        }}
      >
        {contentHeading}
      </button>
    </li>
  )
}

const TabPanel = props => {
  const { contentHeading, contentBody, isActive, parent } = props
  let { eventHandlerForWSIWYG } = useUtilities()
  return (
    <div className={`tab-pane fade ${isActive ? 'show active' : ''}`} id={contentHeading?.replace(/\s/g, '')} role="tabpanel" aria-labelledby={`${contentHeading?.replace(/\s/g, '')}-tab`}>
      <div
        className="content-body"
        onClick={eventHandlerForWSIWYG}
        dangerouslySetInnerHTML={{
          __html: contentBody || '',
        }}
      />
      <div className="tab-panel-children">
        {props?.innerElements
          ?.sort((a, b) => a?.sortOrder - b?.sortOrder)
          ?.map((el, idx) => {
            return React.createElement(parent.__DynamicComponent, { el: el, key: idx })
          })}
      </div>
    </div>
  )
}

const AccordionTab = props => {
  let { eventHandlerForWSIWYG } = useUtilities()
  const { isActive = false, parentContentElementID, contentElementID, setActiveTab, contentHeading, contentBody, parent } = props
  return (
    <div className="accordion-item">
      <h2
        className="accordion-header"
        id={contentElementID}
        onClick={e => {
          e.preventDefault()
          if (isActive) setActiveTab(null)
          if (!isActive) setActiveTab(contentElementID)
        }}
      >
        <button className={`accordion-button ${isActive ? '' : 'collapsed'}`} type="button" data-bs-toggle="collapse" data-bs-target={`#collapse-${contentElementID}`} aria-expanded={isActive} aria-controls={`#collapse-${contentElementID}`}>
          {contentHeading}
        </button>
      </h2>
      <div id={`#collapse-${contentElementID}`} className={`accordion-collapse  collapse ${isActive ? 'show' : ''}`} aria-labelledby={contentElementID} data-bs-parent={`#${parentContentElementID}`}>
        <div
          className="accordion-body"
          onClick={eventHandlerForWSIWYG}
          dangerouslySetInnerHTML={{
            __html: contentBody || '',
          }}
        />
        <div className="tab-panel-children">
          {props?.innerElements
            ?.sort((a, b) => a?.sortOrder - b?.sortOrder)
            ?.map((el, idx) => {
              return React.createElement(parent.__DynamicComponent, { el: el, key: idx })
            })}
        </div>
      </div>
    </div>
  )
}

const AccordionTabs = props => {
  const { innerElements, contentElementID, contentBody = '', contentHeading = '', contentSubHeading = '', ...rest } = props
  let { eventHandlerForWSIWYG } = useUtilities()
  const [activeTab, setActiveTab] = useState(innerElements?.at(0)?.contentElementID)
  return (
    <div className="accordion container my-4" id={contentElementID}>
      {contentHeading?.trim()?.length > 0 && <h2>{contentHeading}</h2>}
      {contentSubHeading?.trim()?.length > 0 && <p className="text-muted">{contentSubHeading}</p>}
      {contentBody?.trim()?.length > 0 && (
        <div
          className="tabs-body"
          onClick={eventHandlerForWSIWYG}
          dangerouslySetInnerHTML={{
            __html: contentBody,
          }}
        />
      )}
      {innerElements
        ?.filter(el => el?.contentElementTypeCode === 'cetTab')
        ?.sort((a, b) => a?.sortOrder - b?.sortOrder)
        ?.map((childTab, index) => {
          return <AccordionTab parent={rest} key={childTab.contentElementID} isActive={childTab.contentElementID === activeTab} setActiveTab={setActiveTab} loc={index} {...childTab} />
        })}
    </div>
  )
}

const VerticalTabs = ({ innerElements = [], contentElementID, contentBody = '', contentHeading = '', contentSubHeading = '', ...rest }) => {
  let { eventHandlerForWSIWYG } = useUtilities()
  const [activeTab, setActiveTab] = useState(innerElements?.at(0)?.contentElementID)
  return (
    <>
      {contentHeading?.trim()?.length > 0 && <h2>{contentHeading}</h2>}
      {contentSubHeading?.trim()?.length > 0 && <p className="text-muted">{contentSubHeading}</p>}
      {contentBody?.trim()?.length > 0 && (
        <div
          className="tabs-body"
          onClick={eventHandlerForWSIWYG}
          dangerouslySetInnerHTML={{
            __html: contentBody,
          }}
        />
      )}
      <div className="d-flex align-items-start verticalTabs shadow flex-wrap flex-md-nowrap">
        <div className="nav flex-md-column nav-pills nav-justified" id={`v-pills-tab-${contentElementID}`} role="tablist" aria-orientation="vertical">
          {innerElements
            ?.filter(el => el?.contentElementTypeCode === 'cetTab')
            ?.sort((a, b) => a?.sortOrder - b?.sortOrder)
            ?.map(childTab => {
              return <TabHeading {...childTab} key={childTab.contentElementID} isActive={childTab.contentElementID === activeTab} setActiveTab={setActiveTab} />
            })}
        </div>
        <div className="tab-content" id={`v-pills-tabContent-${contentElementID}`}>
          {innerElements
            ?.filter(el => el?.contentElementTypeCode === 'cetTab')
            ?.sort((a, b) => a?.sortOrder - b?.sortOrder)
            ?.map(childTab => {
              return <TabPanel parent={rest} {...childTab} key={childTab.contentElementID} isActive={childTab.contentElementID === activeTab} setActiveTab={setActiveTab} />
            })}
        </div>
      </div>
    </>
  )
}
const HorizontalTabs = ({ innerElements = [], contentElementID, contentBody = '', contentHeading = '', contentSubHeading = '', ...rest }) => {
  let { eventHandlerForWSIWYG } = useUtilities()
  const [activeTab, setActiveTab] = useState(innerElements?.at(0)?.contentElementID)
  return (
    <div className="Tabs shadow">
      {contentHeading?.trim()?.length > 0 && <h2>{contentHeading}</h2>}
      {contentSubHeading?.trim()?.length > 0 && <p className="text-muted">{contentSubHeading}</p>}
      {contentBody?.trim()?.length > 0 && (
        <div
          className="tabs-body"
          onClick={eventHandlerForWSIWYG}
          dangerouslySetInnerHTML={{
            __html: contentBody,
          }}
        />
      )}
      <ul className="nav nav-tabs nav-justified border-0" id={`horizontalTabsHeading-${contentElementID}`} role="tablist">
        {innerElements
          ?.filter(el => el?.contentElementTypeCode === 'cetTab')
          ?.sort((a, b) => a?.sortOrder - b?.sortOrder)
          ?.map(childTab => {
            return <TabHeading {...childTab} key={childTab.contentElementID} isActive={childTab.contentElementID === activeTab} setActiveTab={setActiveTab} />
          })}
      </ul>
      <div className="tab-content p-2 p-md-5" id={`horizontalTabsPanels-${contentElementID}`}>
        {innerElements
          ?.filter(el => el?.contentElementTypeCode === 'cetTab')
          ?.sort((a, b) => a?.sortOrder - b?.sortOrder)
          ?.map(childTab => {
            return <TabPanel parent={rest} {...childTab} key={childTab.contentElementID} isActive={childTab.contentElementID === activeTab} setActiveTab={setActiveTab} />
          })}
      </div>
    </div>
  )
}

const SimpleTabs = props => {
  const { tabViewMode = 'horizontalTabs', ...rest } = props
  if (tabViewMode === 'accordion') return <AccordionTabs {...rest} /> //accordion
  if (tabViewMode === 'verticalTabs') return <VerticalTabs {...rest} /> // horizontalTabs
  if (tabViewMode === 'horizontalTabs') return <HorizontalTabs {...rest} /> //verticalTabs

  return null
}

export { TabHeading, TabPanel, SimpleTabs }
