const ORDERTEMPLATECART = 'checkout'
const SUBSCRIPTION = 'subscription'
const SHIPPING = 'shipping'
const PAYMENT = 'payment'
const REVIEW = 'review'

const getOrderTemplateCurrentStep = path => {
  const currentList = orderTemplateCheckOutSteps.filter(step => step.key === path)
  return currentList.length ? currentList[0] : orderTemplateCheckOutSteps[1]
}

const orderTemplateCheckOutSteps = [
  {
    key: ORDERTEMPLATECART,
    progress: 1,
    icon: 'bi bi-cart',
    name: 'frontend.checkout.cart',
    state: '',
    previous: '',
    next: '',
    link: '/scheduled-delivery-cart',
  },
  {
    key: SUBSCRIPTION,
    progress: 2,
    icon: 'bi bi-cart',
    name: 'frontend.checkout.subscription',
    state: '',
    next: 'shipping',
    previous: '/scheduled-delivery-cart',
    link: 'scheduled-delivery-info',
  },
  {
    key: SHIPPING,
    progress: 3,
    icon: 'bi bi-truck',
    name: 'frontend.checkout.shipping',
    state: '',
    next: 'payment',
    previous: '/scheduled-delivery-info',
    link: 'shipping',
  },
  {
    key: PAYMENT,
    progress: 4,
    icon: 'bi bi-credit-card',
    name: 'frontend.checkout.billing',
    state: '',
    previous: 'shipping',
    next: 'review',
    link: 'payment',
  },
  {
    key: REVIEW,
    progress: 5,
    icon: 'bi bi-check-circle-fill',
    name: 'frontend.checkout.review.review_title',
    state: '',
    previous: 'payment',
    next: '',
  },
]

export { orderTemplateCheckOutSteps, ORDERTEMPLATECART, SUBSCRIPTION, SHIPPING, PAYMENT, REVIEW, getOrderTemplateCurrentStep }
