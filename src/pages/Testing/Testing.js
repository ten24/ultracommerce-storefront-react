import { SimpleTabs } from '../../components'
import DynamicPage from '../DynamicPage/DynamicPage'

const Testing = props => {
  let tabData = [
    { title: 'Three', body: ' The tab JavaScript swaps classes to control the content visibility and styling. You can use it with tabs, pills, and any other .nav-powered navigation.    ' },
    { title: 'One ', body: "This is some placeholder content the Home tab's associated content. Clicking another tab will toggle the visibility of this one for the next. The tab JavaScript swaps classes to control the content visibility and styling. You can use it with tabs, pills, and any other .nav-powered navigation.  " },
    { title: 'Two', body: 'Clicking another tab will toggle the visibility of this one for the next. The tab JavaScript swaps classes to control the content visibility and styling. You can use it with tabs, pills, and any other .nav-powered navigation.    ' },
  ]

  return (
    <DynamicPage ignoreLayout={true}>
      <div className="page-title-overlap bg-lightgray pt-4 pb-5">
        <div className="container d-lg-flex justify-content-between py-2 py-lg-3">
          <div className="order-lg-1 pr-lg-4 text-center text-lg-start">
            <h1 className="h3 text-dark mb-0 font-accent">Kitchen Sink</h1>
          </div>
        </div>
      </div>
      <div className="container pb-5 mb-2 mb-md-3">
        <div className="row">
          <section className="col-lg-12">
            <div className="mt-5 pt-5">
              <SimpleTabs data={tabData} />
            </div>
          </section>
        </div>
      </div>
    </DynamicPage>
  )
}

export default Testing
