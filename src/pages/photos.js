import React from "react"

import Layout from "../components/layout"

const Image = () => (
  <a className="js-gallery-link gallery__link gallery__link--small" href="https://lesleh.co.uk/rails/active_storage/blobs/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBbTRDIiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--2297539394b065fd2909059e2634aa53c7489dba/51703156_422624894946935_2735823648280980910_n.jpg%3F_nc_ht=scontent.cdninstagram.com">
    <img className="gallery__image" style={{minWidth: '100px', minHeight: '100px'}} alt="" src="https://lesleh.co.uk/rails/active_storage/representations/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBbTRDIiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--2297539394b065fd2909059e2634aa53c7489dba/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaDdCam9MY21WemFYcGxTU0lNTlRBd2VEVXdNQVk2QmtWVSIsImV4cCI6bnVsbCwicHVyIjoidmFyaWF0aW9uIn19--fb979cd7246ee8b644d965793b279f878ea159a2/51703156_422624894946935_2735823648280980910_n.jpg%3F_nc_ht=scontent.cdninstagram.com"/>
  </a>
)

const Photos = () => {
  return(
    <Layout title="Photos">
      <div className="gallery">
        <Image/>
        <Image/>
        <Image/>
        <Image/>
        <Image/>
        <Image/>
        <Image/>
        <Image/>
        <Image/>
      </div>
    </Layout>
  )
}

export default Photos
