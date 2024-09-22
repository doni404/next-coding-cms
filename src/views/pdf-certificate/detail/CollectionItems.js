// ** React Imports
import { useState, useEffect } from "react";

// ** MUI Imports
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";
import FormLabel from "@mui/material/FormLabel";
import { DataGrid } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

// ** Icons Imports
import DotsVertical from "mdi-material-ui/DotsVertical";
import EyeOutline from "mdi-material-ui/EyeOutline";

// ** Next Import
import Link from "next/link";

// ** Third Party Components
import axios from "axios";

export const BASE_URL_API = process.env.REACT_APP_BASE_URL_API;

// ** Styled component for the link inside menu
const MenuItemLink = styled("a")(({ theme }) => ({
  width: "100%",
  display: "flex",
  alignItems: "center",
  textDecoration: "none",
  padding: theme.spacing(1.5, 4),
  color: theme.palette.text.primary,
}));

const StyledLink = styled("a")(({ theme }) => ({
  textDecoration: "underline",
  color: theme.palette.primary.main,
  cursor: "pointer",
}));

const RowOptions = ({ id }) => {
  // ** State
  const [anchorEl, setAnchorEl] = useState(null);
  const rowOptionsOpen = Boolean(anchorEl);

  const handleRowOptionsClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleRowOptionsClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton size="small" onClick={handleRowOptionsClick}>
        <DotsVertical />
      </IconButton>
      <Menu
        keepMounted
        anchorEl={anchorEl}
        open={rowOptionsOpen}
        onClose={handleRowOptionsClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        PaperProps={{ style: { minWidth: "8rem" } }}
      >
        <MenuItem sx={{ p: 0 }}>
          <Link href={`/item/detail/${id}`} passHref>
            <MenuItemLink>
              <EyeOutline fontSize="small" sx={{ mr: 2 }} />
              詳細
            </MenuItemLink>
          </Link>
        </MenuItem>
      </Menu>
    </>
  );
};

const ImgAbsolute = styled("img")(({ theme }) => ({
  position: "absolute",
  width: "100%",
  height: "100%",
  objectFit: "cover",
}));

const columns = [
  {
    flex: 0.05,
    minWidth: 60,
    field: "id",
    headerName: "id",
    headerAlign: "center",
    align: "center",
    renderCell: ({ row }) => {
      return (
        <Typography noWrap variant="body2" alignCenter>
          {row.id}
        </Typography>
      );
    },
  },
  {
    flex: 0.2,
    minWidth: 180,
    field: "image",
    headerName: "",
    headerAlign: "center",
    align: "center",
    renderCell: ({ row }) => {
      const [imgSrc, setImgSrc] = useState();

      useEffect(() => {
        imageWithAuth(row.image_url);
      }, []);

      const imageWithAuth = async (image_url) => {
        const token = window.sessionStorage.getItem("token");
        const header = {
          headers: { Authorization: `Bearer ${token}` },
          responseType: "blob",
        };
        const response = await axios.get(
          BASE_URL_API + "v1/resources?type=assets&filename=" +
          image_url,
          header
        );
        const fileReader = new FileReader();
        fileReader.readAsDataURL(response.data);
        fileReader.onloadend = function () {
          setImgSrc(fileReader.result);
        };
      };

      return (
        <Box
        sx={{
          pb: "70px",
          width: "133.7px",
          height: 0,
          position: "relative",
        }}
        >
          <ImgAbsolute
            src={imgSrc}
            alt="collection image"
            onError={() => setImgSrc(BASE_URL_API + 'v1/public/resources?type=general_images&filename=nophoto.gif')}
          />
        </Box>
      );
    },
  },
  {
    flex: 0.2,
    minWidth: 250,
    field: "title",
    headerName: "タイトル",
    headerAlign: "center",
    renderCell: ({ row }) => {
      return (
        <Typography noWrap variant="body2">
          {row.name}
        </Typography>
      );
    },
  },
  {
    flex: 0.15,
    field: "owner",
    minWidth: 150,
    headerName: "所有者",
    headerAlign: "center",
    renderCell: ({ row }) => {
      return <Typography variant="body2">{row.owner.username}</Typography>;
    },
  },
  {
    flex: 0.15,
    minWidth: 150,
    field: "public",
    headerName: "カテゴリ",
    headerAlign: "center",
    renderCell: ({ row }) => {
      return <Typography variant="body2">{row.category.name}</Typography>;
    },
  },
  {
    flex: 0.1,
    minWidth: 90,
    sortable: false,
    field: "actions",
    headerName: "",
    headerAlign: "center",
    align: "center",
    renderCell: ({ row }) => <RowOptions id={row.id} />,
  },
];

const CollectionItems = ({ id }) => {
  // ** State
  const [pageSize, setPageSize] = useState(10);
  const [data, setData] = useState(null);
  const [length, setLength] = useState();
  const [error, setError] = useState(false);

  const apiUrl = BASE_URL_API + "v1/assets/collections/" + id;
  const token = window.sessionStorage.getItem("token");

  useEffect(() => {
    axios
      .get(apiUrl, { headers: { Authorization: `Bearer ${token}` } })
      .then((response) => {
        console.log("response item : ", response)
        setData(response.data.data);
        setLength(response.data.data.length);
      })
      .catch(() => {
        setData(null);
        setError(true);
      });
  }, [id]);

  console.log("assets of collection is", data);

  if (data && length > 0) {
    return (
      <Card>
        <CardContent sx={{ pl: 0, pr: 0 }}>
          <Typography variant="h5" sx={{ m: "0 20px 20px" }}>
            作品一覧
          </Typography>
          <DataGrid
            className="tableWithImage"
            rowHeight={90}
            autoHeight
            rows={data}
            columns={columns}
            pageSize={pageSize}
            disableSelectionOnClick
            rowsPerPageOptions={[10, 25, 50]}
            sx={{ "& .MuiDataGrid-columnHeaders": { borderRadius: 0 } }}
            onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
            alignCenter
          />
        </CardContent>
      </Card>
    );
  } else {
    return (
      <Card>
        <CardContent sx={{ pl: 0, pr: 0 }}>
          <Typography variant="h5" sx={{ m: "0 20px 20px" }}>
            作品一覧
          </Typography>
          <Box sx={{ p: 5, pb: 1, mb: 20 }}>
            <Typography variant="body1">
              このコレクションには作品一覧はありません
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }
};

export default CollectionItems;
