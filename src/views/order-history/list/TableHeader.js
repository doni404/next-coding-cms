// ** MUI Imports
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";

const TableHeader = (props) => {
  // ** Props
  const { handleFilter, value } = props;

  return (
    <Box
      sx={{
        p: 5,
        pb: 3,
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
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
          sx={{ mr: 6, mb: 2, width: "100%", maxWidth: 430 }}
          placeholder="取引ハッシュ、総額で検索"
          onChange={(e) => handleFilter(e.target.value)}
        />
      </Box>
    </Box>
  );
};

export default TableHeader;
