const ProductReviewRating = (count) => {
  const starRating = count.total
  const emptyStarRating = 5 - starRating
  let emptyRatings = []
  let fillRatings = []
  for (let emptyRatingCount = 0; emptyRatingCount < emptyStarRating; emptyRatingCount++) {
    emptyRatings.push(<i className="bi bi-star text-primary p-1 active" key={emptyRatingCount}></i>);
  }
  for (let fillRatingCount = 0; fillRatingCount < starRating; fillRatingCount++) {
    fillRatings.push(<i className="bi bi-star-fill text-primary p-1 active" key={fillRatingCount}></i>);
  }
  return (
   <span> {fillRatings}{emptyRatings} </span>
  )
}

export {ProductReviewRating}