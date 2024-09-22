// ** Third Party Imports
import axios from "axios";

// ** Demo Components Imports
import VideoNewsDetailPage from "src/views/video-news/detail/VideoNewsDetailPage";

export const BASE_URL_API = process.env.REACT_APP_BASE_URL_API;

const VideoNewsView = ({ id }) => {
  return <VideoNewsDetailPage id={id} />;
};

/*export const getStaticPaths = async () => {
  const res = await axios.get(BASE_URL_API + 'v1/news_ids')
  const data = await res.data.data
  const paths = data.map(item => ({
    params: { id: `${item.id}` }
  }))
  console.log("static path id : ", paths)
  return {
    paths,
    fallback: false
  }
}

export const getStaticProps = async ({ params }) => {
  console.log("params : ", params)
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

export default VideoNewsView;
