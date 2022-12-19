import { toBoolean } from '../../utils'

/**
 * videoDescription also
 */
const Video = ({ videoAllow, videoAllowfullscreen, videoFrameborder, videoHeight, videoSrc, videoTitle, videoWidth }) => {
  return <iframe width={videoWidth} height={videoHeight} src={videoSrc} title={videoTitle} frameBorder={videoFrameborder} allow={videoAllow} allowFullScreen={toBoolean(videoAllowfullscreen)} />
}
export { Video }
