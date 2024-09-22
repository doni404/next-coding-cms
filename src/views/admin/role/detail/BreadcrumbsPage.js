// ** MUI Imports
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Link from "@mui/material/Link";
import Breadcrumbs from "@mui/material/Breadcrumbs";

// ** Icons Imports
import HomeOutline from "mdi-material-ui/HomeOutline";
import AccountOutline from "mdi-material-ui/AccountOutline";

const BreadcrumbsPage = () => {
    return (
      <Grid container spacing={6} sx={{ mb: 0 }}>
        <Grid item xs={12}>
          <Breadcrumbs aria-label="breadcrumb">
            <Link
              underline="hover"
              sx={{ display: "flex", alignItems: "center" }}
              color="inherit"
              href="/dashboards/crm"
            >
              <HomeOutline sx={{ mr: 0.5 }} fontSize="inherit" />
              ホーム
            </Link>
            <Link
              underline="hover"
              sx={{ display: "flex", alignItems: "center" }}
              color="inherit"
              href="/admin/role/list"
            >
              <AccountOutline sx={{ mr: 0.5 }} fontSize="inherit" />
              管理者の役割
            </Link>
            <Typography
              sx={{ display: "flex", alignItems: "center" }}
              color="text.primary"
            >
              詳細
            </Typography>
          </Breadcrumbs>
        </Grid>
      </Grid>
    );
};

export default BreadcrumbsPage;
