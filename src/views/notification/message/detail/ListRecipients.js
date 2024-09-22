// ** React Imports
import { useState } from "react";

// ** MUI Imports
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";
import Box from "@mui/material/Box";
import FormLabel from "@mui/material/FormLabel";
import Grid from "@mui/material/Grid";
import { DataGrid } from "@mui/x-data-grid";
import Stack from '@mui/material/Stack';

const ListRecipients = ({ data }) => {
  const [pageSize, setPageSize] = useState(7);

  const columns = [
    {
      flex: 0.05,
      field: "id",
      minWidth: 90,
      headerName: "ID",
      headerAlign: "center",
      align: "center",
      renderCell: ({ row }) => (
        <Typography variant="body2">{row.id}</Typography>
      ),
    },
    {
      flex: 0.2,
      minWidth: 230,
      field: "image",
      headerName: "",
      headerAlign: "center",
      align: "center",
      renderCell: ({ row }) => {
        return (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img
              height={70}
              src="https://www.firstmedia.com/files/images/article/2022/02/Better%20Call%20Saul%20Season%206%20Sudah%20Rilis!%20Simak%20Faktanya.jpg"
            />
          </Box>
        );
      },
    },
    {
      flex: 0.3,
      field: "caption",
      minWidth: 90,
      headerName: "キャプション",
      headerAlign: "center",
      renderCell: ({ row }) => (
        <Typography variant="body2">image caption</Typography>
      ),
    },
  ];

  return (
    <Card>
      <CardContent>
        <Typography variant="h5">受信者一覧</Typography>
      </CardContent>
      <Box sx={{ mb: 5 }}>
        <DataGrid
          autoHeight
          columns={columns}
          rows={data}
          pageSize={pageSize}
          disableSelectionOnClick
          rowsPerPageOptions={[7, 10, 25, 50]}
          onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
          sx={{ "& .MuiDataGrid-columnHeaders": { borderRadius: 0 } }}
          components={{
            NoRowsOverlay: () => (
              <Stack height="100%" alignItems="center" justifyContent="center">
                登録はありません
              </Stack>
            )
          }}
        />
      </Box>
    </Card>
  );
};
export default ListRecipients;
