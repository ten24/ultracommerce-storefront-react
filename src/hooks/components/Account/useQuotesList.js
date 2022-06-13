import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { axios, SlatwalApiService } from '../../../services'

const useQuotesList = () => {
  const [quotesList, setQuotesList] = useState([])
  const accountID = useSelector(state => state.userReducer.accountID)

  useEffect(() => {
    let source = axios.CancelToken.source()
    if (accountID) {
      let payload = {}
      SlatwalApiService.quotes.list(payload, {}, source).then(response => {
        if (response.isSuccess()) {
          setQuotesList(response.success().quotesOnAccount.ordersOnAccount)
        }
      })
    }
    return () => {
      source.cancel()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accountID])
  return { quotes: quotesList }
}
export { useQuotesList }
