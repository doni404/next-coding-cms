// ** MUI Imports
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Link from "@mui/material/Link";
import Breadcrumbs from "@mui/material/Breadcrumbs";

// ** Icons Imports
import HomeOutline from "mdi-material-ui/HomeOutline";
import EmailOutline from 'mdi-material-ui/EmailOutline'

const BreadcrumbsPage = () => {
    return (
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Breadcrumbs aria-label="breadcrumb">
            <Link
              underline="hover"
              sx={{ display: "flex", alignItems: "center" }}
              color="inherit"
              href="/dashboards/"
            >
              <HomeOutline sx={{ mr: 0.5 }} fontSize="inherit" />
              ホーム
            </Link>
            <Link
              underline="hover"
              sx={{ display: "flex", alignItems: "center" }}
              color="inherit"
              href="/settings/mail-template/list/"
            >
              <EmailOutline sx={{ mr: 0.5 }} fontSize="inherit" />
                自動メール
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
