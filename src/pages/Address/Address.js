import { Layout } from '../../components'
import { useTranslation } from 'react-i18next'

const Address = () => {
  const { t } = useTranslation()
  return (
    <Layout>
      <h1>{t('frontend.account.addressPage')}</h1>
    </Layout>
  )
}

export default Address
