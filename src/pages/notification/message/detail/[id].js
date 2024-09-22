// ** Third Party Imports
import axios from 'axios'

// ** Demo Components Imports
import MessageDetailPage from "src/views/notification/message/detail/MessageDetailPage";

const MessageView = ({ id, invoiceData }) => {
  return <MessageDetailPage id={id} invoiceData={invoiceData} />;
};

/*export const getStaticPaths = async () => {
  const res = await axios.get('/apps/users/list')
  const userDate = await res.data.allData

  const paths = userDate.map(item => ({
    params: { id: `${item.id}` }
  }))

  return {
    paths,
    fallback: false
  }
}

export const getStaticProps = async ({ params }) => {
  const res = await axios.get('/apps/invoice/invoices')
  const invoiceData = res.data.allData

  return {
    props: {
      invoiceData,
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

export default MessageView;
