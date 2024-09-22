// ** MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

export function dateFormater(date) {
  date = date.substring(0, 10).split("-");
  date = date[0] + "年" + date[1] + "月" + date[2] + "日";
  return date;
}

export function timeFormater(time) {
  time = time.substring(11, time.length - 3);
  return time;
}

const ItemDetailTop = ({data}) => {
  const dataResponse = data.data;
  console.log("dataResponse is", dataResponse);

    return (
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Grid container spacing={3}>
                <Grid item sx={{ display: "flex", pr: 3 }}>
                  <Typography
                    variant="subtitle2"
                    sx={{ mr: 2, color: "text.primary" }}
                  >
                    作成日:
                  </Typography>
                  <Typography variant="body2">
                    {dateFormater(dataResponse.created_at)} {""}
                    {timeFormater(dataResponse.created_at)}
                  </Typography>
                </Grid>
                <Grid item sx={{ display: "flex", pr: 3 }}>
                  <Typography
                    sx={{ mr: 2, fontWeight: 500, fontSize: "0.875rem" }}
                  >
                    最終編集日:
                  </Typography>
                  <Typography variant="body2">
                    {dateFormater(dataResponse.updated_at)} {""}
                    {timeFormater(dataResponse.updated_at)}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    );
};

export default ItemDetailTop;
