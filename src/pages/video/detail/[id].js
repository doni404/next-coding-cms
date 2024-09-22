// ** Third Party Imports
import axios from 'axios'

// ** Demo Components Imports
import ArticleDetailPage from "src/views/video/detail/ArticleDetailPage";

export const BASE_URL_API = process.env.REACT_APP_BASE_URL_API;

const ArticleView = ({ id }) => {
  return <ArticleDetailPage id={id} />;
};

/*export const getStaticPaths = async () => {
  const res = await axios.get(BASE_URL_API + 'v1/articles_ids')
  const data = await res.data.data
  const paths = data.map(item => ({
    params: { id: `${item.id}` }
  }))

  return {
    paths,
    fallback: false
  }
}

export const getStaticProps = async ({ params }) => {
  return {
    props: {
      id: params?.id
    }
  }
}*/

export const getServerSideProps = async (context) => {
  return {
    props: {
      id: context.params?.id,
    },
  };
};

export default ArticleView;
