import { useLocation } from 'react-router-dom'
import { BreadCrumb } from '../../components'

const BlogPostHeader = () => {
  const loc = useLocation()
  const titleizeWord = str => `${str[0].toUpperCase()}${str.slice(1)}`
  const kebabToTitle = str => str.split('-').map(titleizeWord).join(' ')
  const toBreadcrumbs = (link, { rootName = 'Home', nameTransform = s => s } = {}) =>
    link
      .split('/')
      .filter(Boolean)
      .reduce(
        (acc, curr, idx, arr) => {
          acc.path += `/${curr}`
          acc.crumbs.push({
            urlTitle: acc.path,
            title: nameTransform(curr),
          })

          if (idx === arr.length - 1) return acc.crumbs
          else return acc
        },
        { path: '', crumbs: [{ urlTitle: '/', title: rootName }] }
      )
  let crumbs = toBreadcrumbs(loc.pathname, { nameTransform: kebabToTitle })

  return (
    <section className="breadcrumbs">
      <div className="bg-light">
        <div className="container d-flex justify-content-between align-items-center py-3">
          <BreadCrumb crumbs={crumbs.filter(crmb => crmb.urlTitle !== '/')} />
        </div>
      </div>
    </section>
  )
}
export { BlogPostHeader }
