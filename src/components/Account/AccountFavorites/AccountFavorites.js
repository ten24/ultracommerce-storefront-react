import { useAccountFavorites } from '../../../hooks/'
import { ListingPagination, Grid, AccountLayout, AccountContent } from '../../'
import { useTranslation } from 'react-i18next'

const AccountFavorites = ({ customBody = '', contentTitle = '' }) => {
  const { products, isFetching, totalPages, setPage } = useAccountFavorites()
  const { t } = useTranslation()
  return (
    <AccountLayout>
      <AccountContent customBody={customBody} contentTitle={contentTitle} />
      <h2 className="h3 mb-3">{t('frontend.account.favorites.title')}</h2>
      {!isFetching && products.length === 0 && (
        <div className="alert alert-info" role="alert">
          {t('frontend.account.favorites.none')}
        </div>
      )}
      <Grid isFetching={isFetching} products={products} />
      <ListingPagination recordsCount={products.length} totalPages={totalPages} setPage={setPage} />
    </AccountLayout>
  )
}

export { AccountFavorites }
