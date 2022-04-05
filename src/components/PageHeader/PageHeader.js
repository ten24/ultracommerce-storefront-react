import { BreadCrumb } from '../'

const PageHeader = ({ title, subHeading, children, ...props }) => {
  return (
    <div className="page-header bg-light p-4 text-center">
      <div className="text-center">
        <h1 className="display-6">{title}</h1>
        <p className="lead mb-0">{subHeading}</p>
      </div>

      <div className="px-5">
        <BreadCrumb {...props} />
      </div>
    </div>
  )
}

export { PageHeader }
