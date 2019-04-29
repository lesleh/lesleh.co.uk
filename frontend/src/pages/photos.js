import React from 'react';
import { graphql } from 'gatsby';
import classNames from 'classnames';

import Layout from '../components/layout';

function imageSizeFromName(name) {
  if (name.endsWith('_medium')) {
    return 'medium';
  }
  if (name.endsWith('_large')) {
    return 'large';
  }
  return 'small';
}

function thumbnailSrc(node, size) {
  if (size === 'medium') {
    return node.mediumThumbnail.src;
  }
  if (size === 'large') {
    return node.largeThumbnail.src;
  }
  return node.smallThumbnail.src;
}

const Image = ({
  thumbnailUrl, url, name, size,
}) => (
  <a data-name={name} className={classNames('js-gallery-link', 'gallery__link', `gallery__link--${size}`)} href={url}>
    <img className="gallery__image" style={{ minWidth: '100px', minHeight: '100px' }} alt="" src={thumbnailUrl} />
  </a>
);

const Photos = ({ data }) => (
  <Layout title="Photos">
    <div className="gallery">
      { data.allFile.edges.map(edge => (
        <Image
          key={edge.node.name}
          thumbnailUrl={thumbnailSrc(edge.node.childImageSharp, imageSizeFromName(edge.node.name))}
          url={edge.node.childImageSharp.original.src}
          size={imageSizeFromName(edge.node.name)}
        />
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
          name
          childImageSharp {
            id
            smallThumbnail: resize(width: 200, height: 200, quality: 80) {
              src
            }
            mediumThumbnail: resize(width: 400, height: 400, quality: 80) {
              src
            }
            largeThumbnail: resize(width: 600, height: 600, quality: 80) {
              src
            }
            original {
              src
            }
          }
        }
      }
    }
  }
`;
