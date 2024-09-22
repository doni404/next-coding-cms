// ** Third Party Imports
import axios from 'axios'

// ** Demo Components Imports
import TeacherDetailPage from "src/views/teacher/detail/TeacherDetailPage";

export const BASE_URL_API = process.env.REACT_APP_BASE_URL_API;

const TeacherView = ({ id }) => {
  return <TeacherDetailPage id={id} />;
};

// export const getStaticPaths = async () => {
//   const res = await axios.get(BASE_URL_API + 'v1/offices_ids')
//   const data = await res.data.data
//   const paths = data.map(item => ({
//     params: { id: `${item.id}` }
//   }))

//   return {
//     paths,
//     fallback: false
//   }
// }

export const getServerSideProps = async (context) => {
  return {
    props: {
      id: context.params?.id,
    },
  };
};

export default TeacherView;
