import { useEffect, useRef } from 'react'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const ThreeDSRedirect = ({ url, payload, method }) => {
  const formRef = useRef()
  const MySwal = withReactContent(Swal)
  useEffect(() => {
    let timerInterval
    if (method && formRef.current) {
      MySwal.fire({
        title: '3DS Initiated',
        html: 'Redirecting in  <b></b> seconds.',
        timer: 2000,
        timerProgressBar: true,
        didOpen: () => {
          MySwal.showLoading()
          timerInterval = setInterval(() => {
            const b = MySwal.getHtmlContainer().querySelector('b')
            if (b) {
              b.textContent = Math.ceil(MySwal.getTimerLeft() / 1000)
            }
          }, 100)
        },
        willClose: () => {
          clearInterval(timerInterval)
        },
      }).then(result => {
        /* Read more about handling dismissals below */
        if (result.dismiss === MySwal.DismissReason.timer) {
          formRef.current.submit()
        }
      })
    }
    return () => {
      clearInterval(timerInterval)
    }
  })
  return (
    <form style={{ visibility: 'hidden' }} ref={formRef} action={url} method={method}>
      {Object.keys(payload).map(key => {
        return <input key={key} name={key} value={payload[key]} />
      })}
      <button style={{ visibility: 'hidden' }}>Send</button>
    </form>
  )
}
export { ThreeDSRedirect }

/*


https://slatwallPrivate.ultracommerce-dev.co/threeDSHandover

http://localhost:3006/threeDSHandover

https://slatwallPrivate-admin.ultracommerce-dev.co/index.cfm/api/scope/pay360threeDSHandover

http://slatwallPrivate:8906/index.cfm/api/scope/pay360threeDSHandover
*/
