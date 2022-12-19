import { toBoolean } from '../../utils'

const Row = props => {
  const { systemCode, stylingCustomClasses, children, forceColumnsFlag = true } = props

  return (
    <div className={[systemCode, stylingCustomClasses].join(' ')}>
      <div className="container-lg py-5">
        <div className="row">
          {children?.map((el, idx) => {
            return (
              <div key={idx} className={toBoolean(forceColumnsFlag) ? 'col' : 'rowEl'}>
                {el}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
export { Row }
