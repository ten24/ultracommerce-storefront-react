import { useEffect, useRef } from 'react'

const ThreeDSRedirect = ({ url, payload, method }) => {
  const formRef = useRef()

  useEffect(() => {
    if (method && formRef.current) formRef.current.submit()
  })
  return (
    <form style={{ visibility: 'hidden' }} ref={formRef} action={url} method={method}>
      {Object.keys(payload).map(key => {
        return <input key={key} name={key} value={payload[key]} />
      })}
      <button>Send</button>
    </form>
  )
}
export { ThreeDSRedirect }

/*


https://cluson.slatwallcommerce-dev.io/threeDSHandover

http://localhost:3006/threeDSHandover

https://cluson-admin.slatwallcommerce-dev.io/index.cfm/api/scope/pay360threeDSHandover

http://cluson:8906/index.cfm/api/scope/pay360threeDSHandover
*/
