import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { axios, SlatwalApiService } from '../../../services'

const useOrderTemplateList = ({ recordsPerPage = 100, searchTerm = '', currentPageNumber = 1, statusFilter }) => {
  const [keyword, setSearchTerm] = useState(searchTerm)
  const [currentPage, setCurrentPage] = useState(currentPageNumber)
  const [pageRecordsShow] = useState(recordsPerPage)
  const [orderTemplatesList, setOrderTemplatesList] = useState([])
  const accountID = useSelector(state => state.userReducer.accountID)

  useEffect(() => {
    let source = axios.CancelToken.source()
    if (accountID) {
      let payload = {
        pageRecordsShow: recordsPerPage,
        keyword,
        currentPage,
      }
      if (!!statusFilter) {
        payload['f:orderTemplateStatusType.systemCode:in'] = statusFilter
      }
      SlatwalApiService.orderTemplate.list(payload, {}, source).then(response => {
        if (response.isSuccess()) {
          if (!!statusFilter && statusFilter.length) {
            setOrderTemplatesList(response.success().orderTemplates.filter(template => statusFilter.includes(template.orderTemplateStatusType_systemCode)))
          } else {
            setOrderTemplatesList(response.success().orderTemplates)
          }
        }
      })
    }
    return () => {
      source.cancel()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, pageRecordsShow, keyword, accountID])
  return { keyword, setSearchTerm, orderTemplates: orderTemplatesList, setCurrentPage, currentPage, totalPages: 1 }
}
export { useOrderTemplateList }
