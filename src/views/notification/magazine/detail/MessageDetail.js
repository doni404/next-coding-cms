// ** MUI Imports
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";

// ** Custom Components Imports
import MessageInformation from "src/views/notification/magazine/detail/MessageInformation"
import MessagePreview from "src/views/notification/magazine/detail/MessagePreview";

const MessageDetail = (id) => {
  console.log('mail id ', id)
  return (
    <Grid container xs={12}>
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Box sx={{ mb: 12 }}>
              <MessageInformation id={id} />
            </Box>
            <Box>
              <MessagePreview data={id} />
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default MessageDetail;
