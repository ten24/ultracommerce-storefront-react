import React from 'react'
// import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import { AccountContent, AccountLayout } from '../../'
import { Link } from 'react-router-dom'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { deleteAccountAddress } from '../../../actions/'
import { useTranslation } from 'react-i18next'
import { getAllAccountAddresses, getPrimaryAddress } from '../../../selectors/'

const Address = props => {
  const { accountAddressID, address, isPrimary } = props
  const { streetAddress, addressID, city, stateCode, postalCode, name } = address
  const MySwal = withReactContent(Swal)
  const dispatch = useDispatch()
  const { t } = useTranslation()

  return (
    <tr>
      <td className="align-middle">
        <b>{name}</b>
        <br />
        <span className="font-weight-normal">{`${streetAddress}, ${city}, ${stateCode} ${postalCode}`}</span>
      </td>
      <td>{isPrimary && <span className="align-middle badge bg-info ">{t('frontend.core.prinary')}</span>}</td>
      <td>
        <Link
          className="nav-link-style "
          to={{
            pathname: `/my-account/addresses/${addressID}`,
            state: { ...props },
          }}
          data-toggle="tooltip"
        >
          {t('frontend.core.edit')}
        </Link>
      </td>
      <td>
        <button
          type="button"
          className="link-button link nav-link-style"
          onClick={() => {
            MySwal.fire({
              icon: 'info',
              title: <p>{t('frontend.account.address.remove')}</p>,
              showCloseButton: true,
              showCancelButton: true,
              focusConfirm: false,
              confirmButtonText: t('frontend.core.delete'),
            }).then(data => {
              if (data.isConfirmed) {
                dispatch(deleteAccountAddress(accountAddressID))
              }
            })
          }}
        >
          {t(`frontend.core.remove`)}
        </button>
      </td>
    </tr>
  )
}

const AccountAddresses = ({ title, customBody = '', contentTitle }) => {
  const { t } = useTranslation()
  const accountAddresses = useSelector(getAllAccountAddresses)
  const primaryAddress = useSelector(getPrimaryAddress)
  return (
    <AccountLayout title={title}>
      <AccountContent customBody={customBody} contentTitle={contentTitle} />
      <h2 className="h3 mb-3">{t('frontend.account.address.title')}</h2>
      {accountAddresses.length === 0 && (
        <div className="alert alert-info" role="alert">
          {t('frontend.account.address.none')}
        </div>
      )}

      {accountAddresses.length > 0 && (
        <div className="table-responsive font-size-md">
          <table className="table table-striped table-bordered mt-3">
            {/* <thead>
              <tr>
                <th className="dark-grey-text h6">{t('frontend.account.address.heading')}</th>
                <th className="dark-grey-text h6">{t('frontend.core.actions')}</th>
              </tr>
            </thead> */}
            <tbody>
              {accountAddresses &&
                accountAddresses.map((address, index) => {
                  return <Address key={index} {...address} isPrimary={address.accountAddressID === primaryAddress.accountAddressID} />
                })}
            </tbody>
          </table>
        </div>
      )}
      {/* <hr className="pb-4" /> */}
      <div className="text-sm-right">
        <Link className="btn btn-primary" to="/my-account/addresses/new">
          {t('frontend.account.address.add')}
        </Link>
      </div>
    </AccountLayout>
  )
}

export { AccountAddresses }
