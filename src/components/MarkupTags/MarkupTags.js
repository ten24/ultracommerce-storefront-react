import { createElement } from 'react'
import { useUtilities } from '../../hooks'
const getContentID = () => Math.floor(Math.random() * 100000)

const Div = ({ id = getContentID(), className = '', children }) => {
  return (
    <div className={className} id={id} key={id}>
      {children}
    </div>
  )
}

const Section = ({ id = getContentID(), className = '', children }) => {
  return (
    <section className={className} id={id} key={id}>
      {children}
    </section>
  )
}

const Tag = ({ tag = 'div', tagProps = {}, id = getContentID(), className = `dyn-${tag}`, children, props }) => {
  return createElement(tag, { ...tagProps, id, className, key: id }, children)
}

const Article = ({ id = getContentID(), className = '', children }) => {
  return (
    <article className={className} id={id} key={id}>
      {children}
    </article>
  )
}
const Aside = ({ id = getContentID(), className = '', children }) => {
  return (
    <aside className={className} id={id} key={id}>
      {children}
    </aside>
  )
}

const Container = ({ id = getContentID(), className = '', isFluid = true, children }) => {
  return (
    <div className={(isFluid ? `container-fluid ${className}` : `container ${className}`).trim()} id={id} key={id}>
      {children}
    </div>
  )
}
const Pre = ({ id = getContentID(), className = '', children }) => {
  return (
    <pre className={className} id={id} key={id}>
      {children}
    </pre>
  )
}
const Column = ({ id = getContentID(), className = '', width, children, style }) => {
  return (
    <div style={style} className={(!!width ? `col-${width} ${className}` : `col ${className}`).trim()} id={id} key={id}>
      {children}
    </div>
  )
}

const Html = ({ id = getContentID(), className = '', contentBody }) => {
  const { eventHandlerForWSIWYG } = useUtilities()
  return <div onClick={eventHandlerForWSIWYG} className={className} id={id} dangerouslySetInnerHTML={{ __html: contentBody }} />
}

export { getContentID, Tag, Pre, Html, Container, Column, Div, Section, Article, Aside }
