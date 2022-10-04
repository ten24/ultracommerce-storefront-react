import styled from 'styled-components'
const StyledRow = styled.div`
  color: ${props => props.stylingFontColor || '#eee'};
  &:before, &:after {
    background: ${props => props.stylingBackgroundColor || '#fff0'};
  }
  .btn {
    color: ${props => props.stylingBackgroundColor || '#fff0'};
    background: ${props => props.stylingFontColor || '#eee'};
  }
`
const Row = props => {
  const { systemCode, stylingCustomClasses, children } = props

  return (
    <StyledRow {...props} className={['arched-bg', systemCode, stylingCustomClasses].join(' ')}>
      <div className="container text-center">
        <div className="row">
          {children?.map((el, idx) => {
            return (
              <div key={idx} className="col">
                {el}
              </div>
            )
          })}
        </div>
      </div>
    </StyledRow>
  )
}
export { Row }
