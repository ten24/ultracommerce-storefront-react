import { useTranslation } from 'react-i18next'
import { ProductReviewRating } from '../../components'

const ProductReviewListing = ({ isFetching, pageRecords }) => {
	const { t } = useTranslation()
	return (
<div className={`col-sm-6 ${pageRecords.length > 0 ? 'col-md-9' : 'col-md-12 text-center'}`}>
	{pageRecords.length > 0 ? pageRecords.map((productReview,index) => {
	return (
			<div className="repeater" key={index}>
				<div className="reviews-members pt-4 pb-4 bg-white rounded shadow-sm p-4 mb-4">
					<div className="media">
						<div className="media-body">
							<div className="reviews-members-header">
								
								<div className="star-rating float-right">
									<ProductReviewRating total={productReview.rating}/>
									<span className="p-2" >{productReview.reviewerTitle} </span>
								</div>
								<h6 className="mb-1 mt-3"><strong>{productReview.reviewerName}</strong> <span className="text-muted"> {t('frontend.product.review.createdAtText')} {productReview.reviewDate}</span></h6>
							</div>
							<div className="reviews-members-body">
								<p>{productReview.review}</p>
							</div>
						</div>
					</div>
				</div>
			</div>
	)
	}) : <h3>{t('frontend.product.review.emptyRecordsMessage')}</h3>
		
	}
</div>
)
}
export { ProductReviewListing }