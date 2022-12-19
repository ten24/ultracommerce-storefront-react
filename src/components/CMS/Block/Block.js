import { t } from 'i18next'
import { useState } from 'react'
import { SimpleImage, Modal } from '../..'
import { useUtilities } from '../../../hooks'

const Block = ({ contentBody, contentHeading, systemCode }) => {
  let { eventHandlerForWSIWYG } = useUtilities()
  return (
    <div className={`d-flex mb-3 ${systemCode}`}>
      <div className="card w-100">
        <div className="card-body d-flex flex-column bg-light">
          <h2 className="card-title h6">{contentHeading}</h2>
          <div
            className="card-text"
            onClick={eventHandlerForWSIWYG}
            dangerouslySetInnerHTML={{
              __html: contentBody || '',
            }}
          />
        </div>
      </div>
    </div>
  )
}

const BlockProfile = ({ contentBody, imagePath, contentSummary, title, profilePhoneNumber, profileEmailAddress, positionName }) => {
  let { eventHandlerForWSIWYG } = useUtilities()
  const [showModal, setModal] = useState(false)
  return (
    <div className="blockProfile d-flex px-3">
      <div
        className="card w-100 my-3"
        onClick={event => {
          if (event.target.getAttribute('href') && (event.target.getAttribute('href').includes('tel:') || event.target.getAttribute('href').includes('mailto:'))) {
            return
          }
          event.preventDefault()
          setModal(!showModal)
        }}
      >
        <div className="card-body d-flex flex-column bg-light zoom-hover" style={{ lineHeight: '1.2' }}>
          <SimpleImage src={imagePath} className="img-fluid my-3 mx-auto" style={{ maxWidth: '130px' }} alt={title} />
          <h2 className="card-title h6 title mt-2">{title}</h2>
          {positionName && <span className="positionName mb-2">{positionName}</span>}
          {/* {profilePhoneNumber && (
            <a className="btn btn-primary btn-lg text-white px-4 border-0 mt-4" href={`tel:${profilePhoneNumber}`}>
              Contact Me
            </a>
          )} */}
          {profilePhoneNumber && (
            <a className="profilePhoneNumber text-underline" href={`tel:${profilePhoneNumber}`}>
              {profilePhoneNumber}
            </a>
          )}
          {profileEmailAddress && (
            <a className="profileEmailAddress text-underline" href={`mailto:${profileEmailAddress}`}>
              {profileEmailAddress}
            </a>
          )}
          <p
            className="card-subtitle mb-2 text-muted"
            onClick={eventHandlerForWSIWYG}
            dangerouslySetInnerHTML={{
              __html: contentSummary || '',
            }}
          />
        </div>
      </div>
      <Modal show={showModal} setShow={setModal} title="" className="blockProfileModal" size="xLarge">
        <div className="container">
          <div className="row">
            <div className="col-12 col-md-4 col-xl-3 mb-5">
              <SimpleImage src={imagePath} className="img-fluid blockProfileImage" alt={title} />
            </div>
            <div className="col-12 col-md-8 col-xl-9">
              <h2 className="title h6">{title}</h2>
              <p>
                {positionName.length > 1 && (
                  <>
                    <span className="positionName">{positionName}</span>
                    <br />
                  </>
                )}
                {profilePhoneNumber.length > 1 && (
                  <>
                    <a className="profilePhoneNumber text-underline" href={`tel:${profilePhoneNumber}`}>
                      {profilePhoneNumber}
                    </a>
                    <br />
                  </>
                )}
                {profileEmailAddress.length > 1 && (
                  <>
                    <a className="btn btn-primary text-white px-4 mt-2 border-0 profileEmailAddress" href={`mailto:${profileEmailAddress}`}>
                      {t('frontend.core.contact')}
                    </a>
                    <br />
                  </>
                )}
              </p>

              <p
                className="card-body p-0 mb-2"
                onClick={eventHandlerForWSIWYG}
                dangerouslySetInnerHTML={{
                  __html: contentBody || '',
                }}
              />
            </div>
          </div>
        </div>
      </Modal>
    </div>
  )
}

const Blocks = ({ blocks = [] }) => {
  return (
    <div className="container block-list mt-2">
      <div className="uc-grid">
        {blocks.map((item, index) => {
          if (item.elementType === 'cetProfile') {
            return <BlockProfile {...item} key={index} />
          }
          return <Block {...item} key={index} />
        })}
      </div>
    </div>
  )
}
export { Blocks, Block }
