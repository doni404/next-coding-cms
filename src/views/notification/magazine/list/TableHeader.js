// ** MUI Imports
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Link from 'next/link';


const TableHeader = () => {

  return (
    <Box
      sx={{
        p: 5,
        pb: 3,
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        pt: 3,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: { xs: "start", sm: "end" },
          flex: 1,
        }}
      >
        <Link
          sx={{ mb: 2 }}
          href="/notification/magazine/create"
        >
          <Button
            variant="contained">
            メルマガ登録
          </Button>
        </Link>
      </Box>
    </Box>
  );
};

export default TableHeader;
