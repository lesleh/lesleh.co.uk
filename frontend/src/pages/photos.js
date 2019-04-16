import React from 'react';
import { graphql } from 'gatsby';

import Layout from '../components/layout';

const Image = ({ url }) => (
  <a className="js-gallery-link gallery__link gallery__link--small" href={url}>
    <img className="gallery__image" style={{ minWidth: '100px', minHeight: '100px' }} alt="" src={url} />
  </a>
);

const Photos = ({ data }) => (
  <Layout title="Photos">
    <div className="gallery">
      { data.allFile.edges.map(edge => (
        <Image url={edge.node.childImageSharp.original.src} />
      )) }
    </div>
  </Layout>
);

export default Photos;

export const query = graphql`
  {
    allFile(sort: {order: DESC, fields: [name]}, filter: {relativePath: {regex: "/photos/"}}) {
      edges {
        node {
          childImageSharp {
            id
            original {
              width
              height
              src
            }
          }
        }
      }
    }
  }
`;
