import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useGetEntity } from '../'

const useManufacturer = () => {
  let [request, setRequest] = useGetEntity()
  const { gridSize, maxCount } = useSelector(state => state.configuration.shopByManufacturer)
  const countToDisplay = gridSize * 4
  const [currentPage, setPage] = useState(1)

  useEffect(() => {
    if (!request.isFetching && !request.isLoaded) {
      setRequest({ ...request, isFetching: true, isLoaded: false, entity: 'brand', params: { 'P:Show': maxCount, 'f:activeFlag': 1 }, makeRequest: true })
    }
  })
  const sortedList = [
    ...request.data
      .filter(element => {
        return element.brandFeatured === true
      })
      .sort((a, b) => (a.brandName > b.brandName ? 1 : -1)),
    ...request.data
      .filter(element => {
        return element.brandFeatured !== true
      })
      .sort((a, b) => (a.brandName > b.brandName ? 1 : -1)),
  ]
  const start = (currentPage - 1) * countToDisplay
  const end = start + countToDisplay
  return { request, sortedList, pagination: { start, end, currentPage, setPage, countToDisplay } }
}

export { useManufacturer }
