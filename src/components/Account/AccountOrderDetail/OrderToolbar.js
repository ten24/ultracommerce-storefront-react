import { useTranslation } from 'react-i18next'

const OrderToolbar = ({ delivered, orderPayments }) => {
  const { t } = useTranslation()

  return (
    <div className="d-flex justify-content-between align-items-center pt-lg-2 pb-4 pb-lg-5">
      <div className="row justify-content-between w-100 align-items-center">
        <div className="col-sm-6">
          <div>
            <h6 className="h6">
              {t('frontend.order.OrderNo')} #<span>{orderPayments.order_orderNumber}</span>
            </h6>
          </div>
          <div className="text-muted">
            Status <span className="badge bg-success m-0 p-2 ml-2">{delivered}</span>
          </div>
        </div>
        <div className="col-sm-6">
          <div className="row d-flex justify-content-end">
            {/* <div className="mr-3">
              <a href="#" className="btn btn-outline-secondary">
                <i className="bi bi-box-full mr-2"></i> Request RMA
              </a>
            </div> */}
            <button className="btn btn-outline-secondary w-25">
              <i className="bi bi-print mr-2"></i> Print
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export { OrderToolbar }
