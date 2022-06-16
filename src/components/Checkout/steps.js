const CART = 'checkout'
const SHIPPING = 'shipping'
const PAYMENT = 'payment'
const REVIEW = 'review'

const getCurrentStep = path => {
  const currentList = checkOutSteps.filter(step => step.key === path)
  return currentList.length ? currentList[0] : checkOutSteps[1]
}

const checkOutSteps = [
  {
    key: CART,
    progress: 1,
    icon: 'bi bi-cart',
    name: 'frontend.checkout.cart',
    state: '',
    previous: '',
    next: '',
    link: '/shopping-cart',
  },
  {
    key: SHIPPING,
    progress: 2,
    icon: 'bi bi-truck',
    name: 'frontend.checkout.shipping',
    state: '',
    next: 'payment',
    previous: '/shopping-cart',
    link: 'shipping',
  },
  {
    key: PAYMENT,
    progress: 3,
    icon: 'bi bi-credit-card',
    name: 'frontend.checkout.billing',
    state: '',
    previous: 'shipping',
    next: 'review',
    link: 'payment',
  },
  {
    key: REVIEW,
    progress: 4,
    icon: 'bi bi-check-circle-fill',
    name: 'frontend.checkout.review.review_title',
    state: '',
    previous: 'payment',
    next: '',
  },
]

export { checkOutSteps, CART, SHIPPING, PAYMENT, REVIEW, getCurrentStep }
