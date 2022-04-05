import { getErrorMessage } from '../../../utils'
import { SlatwalApiService, axios } from '../../../services'
import { useEffect, useState } from 'react'

const useReview = productUrlTitle => {
  let [isFetching, setFetching] = useState(true)
  let [currentPage, setCurrentPage] = useState(1)
  let [records, setRecords] = useState([])
  let [ratingCount, setRatingCount] = useState([])
  let [total, setTotal] = useState(0)
  let [pageSize, setPageSize] = useState(3)
  let [totalPages, setTotalPages] = useState(1)
  let [averageRating, setAverageRating] = useState(0)
  let [error, setError] = useState({ isError: false, message: '' })

  useEffect(() => {
    let source = axios.CancelToken.source()
    let totalRating = 0
    let sumofRating = 0
    setFetching(true)
    SlatwalApiService.products.getReviews({ urlTitle: productUrlTitle, 'p:current': currentPage, 'p:show': pageSize }).then(response => {
      if (response.isSuccess() && Object.keys(response.success()?.errors || {}).length) setError({ isError: true, message: getErrorMessage(response.success().errors) })
      if (response.isSuccess()) {
        const data = response.success().productReviews
        const reviews = data.pageRecords.map(sku => {
          return { ...sku, reviewerName: sku.reviewerName, reviewerTitle: sku.reviewTitle, review: sku.review, rating: sku.rating, reviewDate: sku.createdDateTime }
        })

        let reviewStack = response.success().productReviewsCount?.reverse()
        reviewStack = [5, 4, 3, 2, 1]
          .map(rating => {
            return { activeFlag: ' ', createdDateTime: ' ', productReviewID: ' ', rating, ratingCount: 0, review: ' ', reviewTitle: ' ', reviewerName: ' ' }
          })
          .map(reviewItem => {
            const actualReview = reviewStack.filter(canReview => reviewItem.rating === canReview.rating)
            return actualReview.length ? actualReview[0] : reviewItem
          })

        reviewStack = reviewStack.map(reviewData => {
          totalRating = totalRating + reviewData.ratingCount
          sumofRating = sumofRating + reviewData.rating * reviewData.ratingCount
          return { ...reviewData, ratingCount: reviewData.ratingCount }
        })
        setRatingCount(reviewStack)
        setRecords(reviews)
        setTotal(totalRating)
        setTotalPages(data.totalPages)
        setAverageRating(isNaN(sumofRating / totalRating) ? '0' : Math.round(sumofRating / totalRating))
        setError({ isError: false, message: '' })
      } else {
        setRatingCount([])
        setRecords([])
        setTotal(0)
        setPageSize(10)
        setTotalPages(1)
        setError({ isError: true, message: 'Something was wrong' })
      }
      setFetching(false)
    })

    return () => {
      source.cancel()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productUrlTitle, currentPage])

  return { records, currentPage, setCurrentPage, pageSize, isFetching, total, totalPages, error, ratingCount, averageRating }
}

export { useReview }
