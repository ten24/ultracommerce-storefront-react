import { useTranslation } from 'react-i18next'

const AddressCard = ({ address, viewOnly = false, onClick, children }) => {
  const { t } = useTranslation()
  return (
    <div className="bg-lightgray rounded mb-2 col p-3" key={address?.addressID}>
      <div>
        <b>{address.name}</b>
        <br />
        {address.streetAddress} <br />
        {`${address.city}, ${address.stateCode} ${address.postalCode}`} <br />
      </div>
      {children}
      {!viewOnly && (
        <>
          <hr />
          <button
            className="btn btn-link p-0 text-danger"
            type="button"
            disabled={false}
            onClick={event => {
              event.preventDefault()
              onClick()
            }}
          >
            <i className="bi bi-times-circle"></i>
            <span className="small"> {t(`frontend.core.changeSelection`)}</span>
          </button>
        </>
      )}
    </div>
  )
}

export { AddressCard }
