// ** MUI Imports
import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

// ** Icons Imports
import ExportVariant from "mdi-material-ui/ExportVariant";

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
          justifyContent: "space-between",
          flex: 1,
        }}
      >
        <TextField
          size="small"
          value={value}
          sx={{ mr: 6, mb: 2 }}
          placeholder="タイトル、件名で検索"
          onChange={(e) => handleFilter(e.target.value)}
        />
        {/* <Button sx={{ mb: 2 }} onClick={toggle} variant="contained">
        自動メール登録
        </Button> */}
      </Box>
    </Box>
  );
};

export default TableHeader;
