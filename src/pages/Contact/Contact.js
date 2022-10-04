import BasicPageWithSidebar from '../BasicPageWithSidebar/BasicPageWithSidebar'
import DynamicPage from '../DynamicPage/DynamicPage'
import ContactForm from './ContactForm'

const Contact = () => {
  return (
    <DynamicPage ignoreLayout={true}>
      <BasicPageWithSidebar>
        <ContactForm />
      </BasicPageWithSidebar>
    </DynamicPage>
  )
}

export default Contact
