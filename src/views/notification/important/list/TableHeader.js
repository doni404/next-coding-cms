// ** MUI Imports
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

const TableHeader = (props) => {
  // ** Props
  const { handleFilter, toggle, value } = props;

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
        <Button sx={{ mb: 2 }} onClick={toggle} variant="contained">
        重要メール登録
        </Button>
      </Box>
    </Box>
  );
};

export default TableHeader;
