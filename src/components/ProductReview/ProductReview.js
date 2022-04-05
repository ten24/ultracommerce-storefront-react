import { ListingPagination, ProductReviewListing, ProductReviewRating } from '../../components'
import { useReview } from '../../hooks'
import { useTranslation } from 'react-i18next'

const ProductReview = ({ productUrlTitle }) => {
  const { records, isFetching, total, totalPages, setCurrentPage, currentPage, ratingCount, averageRating } = useReview(productUrlTitle)
  const { t } = useTranslation()
  const average = isNaN(averageRating) ? '0' : Math.round(averageRating)
  return (
    <section id="productReviews" className="content-spacer bg-light product-review">
      <div className="container">
        <header className="section-title mb-5 pb-2">
          <h2 className="mb-5">{t('frontend.product.review.mainHeading')}</h2>
        </header>
        <div className="mb-5">
          <div className="row">
            <div className="col-md-12">
              <div className="row">
                <div className="bg-transparent col-sm-6 col-md-3 mb-4 mb-md-0">
                  <div className="d-flex align-items-baseline">
                    <div className="star-rating">
                      <ProductReviewRating total={average} />
                    </div>
                    <p className="text-black ml-2 p-2">{average + ' ' + t('frontend.product.review.chart.totalReviewText')}</p>
                  </div>

                  <p className="total-reviews">
                    {total} {t('frontend.product.review.chart.reviewText')}
                  </p>
                  <div className="graph-star-rating-body">
                    {ratingCount.map((review, index) => {
                      const ratePer = total > 0 ? Math.round((review.ratingCount / total) * 100) : "0"
                      return (
                        <div className="d-flex align-items-center" key={index}>
                          <div className="rating-list-left text-black">{review.rating + ' ' + t('frontend.product.review.chart.starTitle')}</div>
                          <div className="rating-list-center p-3">
                            <div className="progress">
                              <div style={{ width: ratePer + '%' }} aria-valuemax="5" aria-valuemin="0" aria-valuenow="5" role="progressbar" className="progress-bar bg-primary">
                                <span className="sr-only opacity-0"></span>
                              </div>
                            </div>
                          </div>
                          <div className="rating-list-right text-black">{ratePer} %</div>
                        </div>
                      )
                    })}
                  </div>
                </div>
                <ProductReviewListing isFetching={isFetching} pageRecords={records} />
                <ListingPagination recordsCount={total} currentPage={currentPage} totalPages={totalPages} setPage={setCurrentPage} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
export { ProductReview }
