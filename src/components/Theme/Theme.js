import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Helmet } from 'react-helmet'
const baseVars = ['--bs-primary: var(--uc-primarycolor)', '--bs-secondary: var(--uc-secondarycolor)', '--bs-success: var(--uc-successcolor)', '--bs-info: var(--uc-infocolor)', '--bs-warning: var(--uc-warningcolor)', '--bs-danger: var(--uc-dangercolor)', '--bs-light: var(--uc-lightolor)', '--bs-dark: var(--uc-darkcolor)', '--bs-body-font-size: var(--uc-fontSize)']

const Theme = ({ children }) => {
  const [safeToLoad, setSafeToLoad] = useState(false)
  const [stylesToLoad, setStylesToLoad] = useState([])
  const [dynamicCSS, setDynamicCSS] = useState('')
  const theme = useSelector(state => state.configuration.site.theme)
  const siteCode = useSelector(state => state.configuration.site.siteCode)

  useEffect(() => {
    const temporaryTheme = { ...theme }
    setDynamicCSS(temporaryTheme.customCss)
    delete temporaryTheme.customCss
    delete temporaryTheme.themeDescription
    delete temporaryTheme.themeID
    let cssVariables = []
    Object.keys(temporaryTheme)
      .sort()
      .forEach(item => {
        cssVariables = [...cssVariables, `--uc-${item.toLowerCase()}: ${temporaryTheme[item]}`]
      })
    setStylesToLoad([...cssVariables, ...baseVars].join(';\n'))
    setSafeToLoad(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme?.themeID])

  let helmetStyles = [
    { type: 'text/css', cssText: `:root {\n${stylesToLoad}\n}` },
    { type: 'text/css', cssText: dynamicCSS },
  ]
  let helmetLinks = []
  if (theme?.favicon?.trim()?.length > 0) {
    helmetLinks.push(  {"rel": "icon", 
    "type": "image/png", 
    "href": `${process.env.REACT_APP_HOST_URL}${theme.favicon}`
   })
  }
  if (safeToLoad) {
    return (
      <div className={[siteCode, theme?.themeName].filter(a => a).join(' ')}>
        <Helmet
          style={helmetStyles}
          link={helmetLinks}
        />
        {children}
      </div>
    )
  }
  return null
}

export { Theme }
