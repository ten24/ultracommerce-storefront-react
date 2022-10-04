import { useSelector } from 'react-redux'
import { DynamicComponent } from '../../components/DynamicComponent/DynamicComponent'
import { useBasicPage, useUtilities } from '../../hooks'

const BarrierPage = ({ accessFlag = false }) => {
  const globalconfig = useSelector(state => state.content.globalconfig)
  let { eventHandlerForWSIWYG } = useUtilities()
  if (accessFlag) return null
  return (
    <div className="barrierContent">
      {globalconfig
        ?.filter(entry => entry.urlTitle === 'barrier-page-content')
        ?.map(entry => {
          return <div onClick={eventHandlerForWSIWYG} dangerouslySetInnerHTML={{ __html: entry?.contentBody }} />
        })}
    </div>
  )
}

const pageStruct = [
  // {
  //   systemCode: 'cetProductListing',
  //   contentID: '8ab1956f7d3e73b4017d4e517c71001d',
  // },
  {
    systemCode: 'cetTabs',
    sortOrder: 1,
    children: [
      {
        title: 'OUR COMPANY',
        systemCode: 'cetTab',
        contentBody: ' ',
        contentID: '8ab1953f7d15aa6b017d1fdd54490021',
        key: '8ab1953f7d15aa6b017d1fdd54490021',
        children: [
          {
            title: 'THE ALPHAGARY GROUP',
            contentBody:
              '<p>Alphagary is part of <a href="http://www.orbia.com">Orbia</a>, a community of companies working together to tackle some of the world&#39;s most complex challenges.&nbsp; We are bound by a common purpose:&nbsp; to Advance Life Around the World.</p>\r\n\r\n<p>Alphagary manufactures specialty <strong><u>compounds</u></strong>, formulated from a variety of polymers, that are purpose-designed for a wide range of applications.&nbsp;&nbsp; Alphagary also formulates <strong><u>stabilizers</u>, <u>plasticizers</u></strong> and <strong><u>colorants</u></strong> designed for use in vinyl compounds.</p>\r\n\r\n<p>Our strength starts with our talented team who work together across the globe to bring solutions to our customers. &nbsp;We&rsquo;ve earned lasting relationships with customers because we are agile and approachable and enjoy working together to answer new and evolving performance criteria.&nbsp; We welcome the opportunity to work with new customers as we stretch and expand our innovation capabilities, often tailoring a compound to the performance requirements needed.&nbsp;&nbsp; And we depend on our supply partners who provide the solid foundation to support our innovative initiatives as well as ongoing raw material requirements.&nbsp;</p>\r\n\r\n<p>Over the years, our portfolio has expanded tremendously through innovation and through acquisition.&nbsp; We work with <strong><u>PVC, TPE, Olefin, PU, and various other base polymers</u></strong> to create durable and functional materials.&nbsp; &nbsp;Customers benefit from our diverse and proven off-the-shelf compounds as well as our ability to custom formulate.&nbsp; Our adaptability provides value and quickly resolves pain-points that allows our customers to move forward with their own innovation strategies.&nbsp;</p>\r\n\r\n<p>Many of our materials have been formulated to meet <strong><u>market-specific</u></strong> application criteria. &nbsp;Often, we are called upon to provide information to assist third-party approval processes.&nbsp; Our experienced team is able to answer regulatory questions, provide internal and external testing certifications and data that help determine the compound&rsquo;s ability to meet stringent performance criteria.&nbsp; &nbsp;&nbsp;</p>\r\n\r\n<p>Alphagary is dedicated to the safety of our employees.&nbsp; Our goal is that all employees go home in the same condition that they came to work.&nbsp; Each month, we highlight a life-saving rule that is meant to remind us of serious hazards.&nbsp; Additionally, employees undergo site-specific and job-specific safety training.&nbsp; Training guidelines are documented in <strong><u>site certifications</u></strong> to ensure consistency and repeatability.&nbsp; Certifications such as ISO 9001 govern our quality practices to ensure material performance repeatability and consistency that our customers depend upon.&nbsp;</p>\r\n\r\n<p>We encourage you to <strong><u>contact us</u></strong>!&nbsp; Put our team to work on your project and experience first-hand the value we bring today and in preparation for the future.&nbsp;</p>',
            contentID: '8ab1953f7d15aa6b017d1fdde9a30022',
            systemCode: 'cetListItemWithImage',
            key: '8ab1953f7d15aa6b017d1fdde9a30022',
            imagePath: '/custom/assets/images/content/46d92301-3753-4638-a819-912ab09eebe2.jpg',
            linkUrl: ' ',
            linkLabel: ' ',
            children: [
              {
                linkLabel: ' ',
                profilePhoneNumber: ' ',
                profileEmailAddress: ' ',
                positionName: ' ',
                linkUrl: ' ',
                body: '<p style="text-align:center"><a href="/automotive" data-bs-toggle="collapse" data-bs-target=".navbar-collapse.show">Automotive</a></p>\r\n\r\n<p style="text-align:center"><a href="/automotive" data-bs-toggle="collapse" data-bs-target=".navbar-collapse.show"><img alt="Automotive" src="https://api.alphagary.com/custom/assets/Images/Automotive.png" style="height:124; width:180px" /></a></p>',
                contentSummary: ' ',
                contentBody: '<p style="text-align:center"><a href="/automotive" data-bs-toggle="collapse" data-bs-target=".navbar-collapse.show">Automotive</a></p>\r\n\r\n<p style="text-align:center"><a href="/automotive" data-bs-toggle="collapse" data-bs-target=".navbar-collapse.show"><img alt="Automotive" src="https://api.alphagary.com/custom/assets/Images/Automotive.png" style="height:124; width:180px" /></a></p>',
                systemCode: 'cetBlock',
              },
            ],
          },
          {
            title: 'Shakun Polymers is part of Alphagary, an Orbia company',
            contentBody: '<p>In June 2021, Alphagary entered into an agreement with Shakun Polymers to acquire majority share ownership.</p>\r\n\r\n<p>As a direct complement to Alphagary&rsquo;s specialty product offerings that support a connected world, Shakun&rsquo;s product development focus is on halogen-free, flame-retardant compounds and PVC-based compounds for data and power cables. In addition, Shakun&rsquo;s semi-conductive and cross-linkable compounds expand Alphagary&rsquo;s portfolio, offer a growth platform and meet customer requirements.&nbsp; For more information about Shakun, visit <a href="http://www.shakunpolymers.com">www.shakunpolymers.com</a>.</p>',
            contentID: '8ab1953f7d15aa6b017d1fdfaa980023',
            systemCode: 'cetListItem',
            key: '8ab1953f7d15aa6b017d1fdfaa980023',
            imagePath: '/custom/assets/images/content/u103-1.jpg',
            linkUrl: ' ',
            linkLabel: ' ',
          },
          {
            title: 'Sylvin Technologies is part of Alphagary, an Orbia company',
            contentBody: '<p>In 2018, Sylvin Technologies became part of Alphagary. Located in Lancaster County, Pennsylvania, Sylvin has evolved as a leading supplier of PVC compounds available in custom and standard formulations for a variety of market applications. For more information on Sylvin&rsquo;s materials, visit <a href="https://www.sylvin.com">www.sylvin.com</a><a href="http://www.sylvintechnologies.com">.&nbsp;&nbsp;</a></p>',
            contentID: '8ab1953f7d15aa6b017d1fe08fa70024',
            systemCode: 'cetListItem',
            key: '8ab1953f7d15aa6b017d1fe08fa70024',
            imagePath: '/custom/assets/images/content/u103-1.jpg',
            linkUrl: ' ',
            linkLabel: ' ',
          },
        ],
      },
      {
        title: 'OUR TEAM',
        systemCode: 'cetTab',
        contentBody: ' ',
        contentID: '8ab1953f7d15aa6b017d1fe4529e0025',
        key: '8ab1953f7d15aa6b017d1fe4529e0025',
      },
      {
        title: 'MANUFACTURING LOCATIONS',
        systemCode: 'cetTab',
        contentBody: ' ',
        contentID: '8ab1b3387d1fe35c017d1fe515900005',
        key: '8ab1b3387d1fe35c017d1fe515900005',
      },
    ],
  },
  {
    title: 'Shop by Category or Product Type',
    contentTitle: 'Shop by Category or Product Type',
    contentBody: ' ',
    sortOrder: 6,
    contentID: '8ab195747eac1f5f017ec016fd8d0040',
    systemCode: 'cetColumns',
    columns: [
      {
        title: 'Shop By Product',
        title_link: ' ',
        linkLabel: ' ',
        linkUrl: ' ',
        body: '<p>Browse and shop the entire catalog.</p>\r\n\r\n<p>&bull;&nbsp;<a href="/product-type/accessories">Accessories</a><br />\r\n&bull;&nbsp;<a href="/product-type/baseball">Baseball</a><br />\r\n&bull;&nbsp;<a href="/product-type/cleaners-spray-polish">Cleaners, Spray &amp; Polish</a><br />\r\n&bull;&nbsp;<a href="/product-type/field-equipment">Field Equipment</a><br />\r\n&bull;&nbsp;<a href="/product-type/footwear">Footwear</a><br />\r\n&bull;&nbsp;<a href="/product-type/goals">Goals</a><br />\r\n&bull;&nbsp;<a href="/product-type/shoe-accessories">Shoe Accessories</a><br />\r\n&bull;&nbsp;<a href="/product-type/socks">Socks</a><br />\r\n&bull;&nbsp;<a href="/product-type/spray-paint">Spray Paint</a><br />\r\n&bull;&nbsp;<a href="/product-type/sports-equipment">Sports Equipment</a></p>',
        contentSummary: ' ',
        contentBody:
          '<p>Browse and shop the entire catalog.</p>\r\n\r\n<p>&bull;&nbsp;<a href="/product-type/accessories">Accessories</a><br />\r\n&bull;&nbsp;<a href="/product-type/baseball">Baseball</a><br />\r\n&bull;&nbsp;<a href="/product-type/cleaners-spray-polish">Cleaners, Spray &amp; Polish</a><br />\r\n&bull;&nbsp;<a href="/product-type/field-equipment">Field Equipment</a><br />\r\n&bull;&nbsp;<a href="/product-type/footwear">Footwear</a><br />\r\n&bull;&nbsp;<a href="/product-type/goals">Goals</a><br />\r\n&bull;&nbsp;<a href="/product-type/shoe-accessories">Shoe Accessories</a><br />\r\n&bull;&nbsp;<a href="/product-type/socks">Socks</a><br />\r\n&bull;&nbsp;<a href="/product-type/spray-paint">Spray Paint</a><br />\r\n&bull;&nbsp;<a href="/product-type/sports-equipment">Sports Equipment</a></p>',
        imagePath: '/custom/assets/images/content/Soccer.jpg',
        systemCode: 'cetColumn',
      },
      {
        title: 'Shop by Category',
        title_link: ' ',
        linkLabel: ' ',
        linkUrl: ' ',
        body: '<p>Find the best product by sport or activity.</p>\r\n\r\n<p>&bull;&nbsp;<a href="/category/baseball">Baseball</a><br />\r\n&bull;&nbsp;<a href="/category/basketball/">Basketball</a><br />\r\n&bull;&nbsp;<a href="/category/golf">Golf</a><br />\r\n&bull;&nbsp;<a href="/category/guides">Guides</a><br />\r\n&bull;&nbsp;<a href="/category/hockey/">Hockey</a><br />\r\n&bull;&nbsp;<a href="/category/premium-content">Premium Content</a><br />\r\n&bull;&nbsp;<a href="/category/soccer">Soccer</a><br />\r\n&bull;&nbsp;<a href="/category/volleyball">Volleyball</a><br />\r\n&nbsp;</p>',
        contentSummary: ' ',
        contentBody: '<p>Find the best product by sport or activity.</p>\r\n\r\n<p>&bull;&nbsp;<a href="/category/baseball">Baseball</a><br />\r\n&bull;&nbsp;<a href="/category/basketball/">Basketball</a><br />\r\n&bull;&nbsp;<a href="/category/golf">Golf</a><br />\r\n&bull;&nbsp;<a href="/category/guides">Guides</a><br />\r\n&bull;&nbsp;<a href="/category/hockey/">Hockey</a><br />\r\n&bull;&nbsp;<a href="/category/premium-content">Premium Content</a><br />\r\n&bull;&nbsp;<a href="/category/soccer">Soccer</a><br />\r\n&bull;&nbsp;<a href="/category/volleyball">Volleyball</a><br />\r\n&nbsp;</p>',
        imagePath: '/custom/assets/images/content/yoav-hornung-kQ55djHUcEY-unsplash.jpg',
        systemCode: 'cetColumn',
      },
      {
        title: 'Special Offers',
        title_link: ' ',
        linkLabel: ' ',
        linkUrl: ' ',
        body: '<p>The best deals, new gear and other special offers.</p>\r\n\r\n<p>&bull;&nbsp;<a href="/winter-gear">The Best in Winter Gear</a><br />\r\n&bull;&nbsp;<a href="/whats-new">What&#39;s New</a><br />\r\n&bull;&nbsp;<a href="/new-style">New Season, New Styles</a><br />\r\n&bull;&nbsp;<a href="/just-arrived">Just Arrived</a><br />\r\n&bull;&nbsp;<a href="/clearance">Clearance</a></p>',
        contentSummary: ' ',
        contentBody: '<p>The best deals, new gear and other special offers.</p>\r\n\r\n<p>&bull;&nbsp;<a href="/winter-gear">The Best in Winter Gear</a><br />\r\n&bull;&nbsp;<a href="/whats-new">What&#39;s New</a><br />\r\n&bull;&nbsp;<a href="/new-style">New Season, New Styles</a><br />\r\n&bull;&nbsp;<a href="/just-arrived">Just Arrived</a><br />\r\n&bull;&nbsp;<a href="/clearance">Clearance</a></p>',
        imagePath: '/custom/assets/images/content/bruno-nascimento-PHIgYUGQPvU-unsplash.jpg',
        systemCode: 'cetColumn',
      },
    ],
  },
  // {
  //   title: 'THE ALPHAGARY GROUP',
  //   contentBody:
  //     '<p>Alphagary is part of <a href="http://www.orbia.com">Orbia</a>, a community of companies working together to tackle some of the world&#39;s most complex challenges.&nbsp; We are bound by a common purpose:&nbsp; to Advance Life Around the World.</p>\r\n\r\n<p>Alphagary manufactures specialty <strong><u>compounds</u></strong>, formulated from a variety of polymers, that are purpose-designed for a wide range of applications.&nbsp;&nbsp; Alphagary also formulates <strong><u>stabilizers</u>, <u>plasticizers</u></strong> and <strong><u>colorants</u></strong> designed for use in vinyl compounds.</p>\r\n\r\n<p>Our strength starts with our talented team who work together across the globe to bring solutions to our customers. &nbsp;We&rsquo;ve earned lasting relationships with customers because we are agile and approachable and enjoy working together to answer new and evolving performance criteria.&nbsp; We welcome the opportunity to work with new customers as we stretch and expand our innovation capabilities, often tailoring a compound to the performance requirements needed.&nbsp;&nbsp; And we depend on our supply partners who provide the solid foundation to support our innovative initiatives as well as ongoing raw material requirements.&nbsp;</p>\r\n\r\n<p>Over the years, our portfolio has expanded tremendously through innovation and through acquisition.&nbsp; We work with <strong><u>PVC, TPE, Olefin, PU, and various other base polymers</u></strong> to create durable and functional materials.&nbsp; &nbsp;Customers benefit from our diverse and proven off-the-shelf compounds as well as our ability to custom formulate.&nbsp; Our adaptability provides value and quickly resolves pain-points that allows our customers to move forward with their own innovation strategies.&nbsp;</p>\r\n\r\n<p>Many of our materials have been formulated to meet <strong><u>market-specific</u></strong> application criteria. &nbsp;Often, we are called upon to provide information to assist third-party approval processes.&nbsp; Our experienced team is able to answer regulatory questions, provide internal and external testing certifications and data that help determine the compound&rsquo;s ability to meet stringent performance criteria.&nbsp; &nbsp;&nbsp;</p>\r\n\r\n<p>Alphagary is dedicated to the safety of our employees.&nbsp; Our goal is that all employees go home in the same condition that they came to work.&nbsp; Each month, we highlight a life-saving rule that is meant to remind us of serious hazards.&nbsp; Additionally, employees undergo site-specific and job-specific safety training.&nbsp; Training guidelines are documented in <strong><u>site certifications</u></strong> to ensure consistency and repeatability.&nbsp; Certifications such as ISO 9001 govern our quality practices to ensure material performance repeatability and consistency that our customers depend upon.&nbsp;</p>\r\n\r\n<p>We encourage you to <strong><u>contact us</u></strong>!&nbsp; Put our team to work on your project and experience first-hand the value we bring today and in preparation for the future.&nbsp;</p>',
  //   contentID: '8ab1953f7d15aa6b017d1fdde9a30022',
  //   systemCode: 'cetListItemWithImage',
  //   key: '8ab1953f7d15aa6b017d1fdde9a30022',
  //   imagePath: '/custom/assets/images/content/46d92301-3753-4638-a819-912ab09eebe2.jpg',
  //   linkUrl: ' ',
  //   linkLabel: ' ',
  // },
]
const PageDisplay = ({ content, setPage, request }) => {
  return (
    <div className="barrierContent">
      {pageStruct
        ?.sort((a, b) => a?.sortOrder - b?.sortOrder)
        ?.map((pageEl, idx) => {
          return <DynamicComponent el={pageEl} key={`main${idx}`} />
        })}
      {/* 
      {!content.isMarkup &&
        content.sections &&
        content.sections.map(({ title, text, imageUrl }) => {
          return (
            <div key={title}>
              <h2>{title}</h2>
              <div className="row">
                <div className="col-md-8">{text}</div>
                <div className="col-md-4">{imageUrl !== '' && <img className="float-end ml-md-2 mb-md-2 about-Img" src={imageUrl} alt={title} />}</div>
              </div>
            </div>
          )
        })}
     

*/}
    </div>
  )
}
const BasicPage = () => {
  const { content, request, setPage } = useBasicPage()
  return (
    <div className="p-0">
      <div className="page-title-overlap bg-lightgray pt-4">
        <div className="container d-lg-flex justify-content-between py-2 py-lg-3">
          <div className="order-lg-1 pr-lg-4 text-center">
            <h1 className="h3 text-dark mb-0 font-accent">{content.title || ''}</h1>
          </div>
        </div>
      </div>
      <div className="basic container bg-white shadow-sm rounded-3 p-4 p-lg-5 mb-5">
        {content?.permissions?.accessFlag && <PageDisplay content={content} request={request} setPage={setPage} />}
        {!content?.permissions?.accessFlag && <BarrierPage {...content.permissions} />}
      </div>
    </div>
  )
}

export default BasicPage
