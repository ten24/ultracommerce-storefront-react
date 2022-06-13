import { useEffect, useState } from 'react'
import { QuoteDetail, AccountLayout } from '../../'
import { getOrder } from '../../../actions'
import { useDispatch } from 'react-redux'

const AccountQuoteDetail = props => {
  const orderID = props.path
  const [quoteDetail, setQuoteDetail] = useState()

  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(
      getOrder({
        params: {
          orderID,
        },
        returnQuote: true,
        isQuote: true,
      })
    ).then(response => {
      setQuoteDetail(response.success().quote)
    })
    // eslint-disable-next-line
  }, [])

  return <AccountLayout>{quoteDetail?.orderID && <QuoteDetail quoteDetail={quoteDetail} updateQuote={setQuoteDetail} />}</AccountLayout>
}
export { AccountQuoteDetail }
