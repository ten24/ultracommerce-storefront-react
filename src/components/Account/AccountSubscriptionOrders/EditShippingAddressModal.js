import { OrderTemplateShippingSelector } from '../../'

const EditShippingAddressModal = ({orderInfo,shipping,setShipping,updateShipping}) => {
  
  return (
    <div className="row mb-3">
      <div className="col-sm-12">
        <OrderTemplateShippingSelector
            selectedAccountID={shipping}
            onSelect={value => {
                setShipping(value)
                updateShipping({
                  accountAddressID: value
                })
            }}
            onSave={values => {
              updateShipping(values)
            }}
          />        
      </div>
    </div>
  )
}

export { EditShippingAddressModal }
