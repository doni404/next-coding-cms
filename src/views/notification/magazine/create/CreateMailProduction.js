import { Card, CardContent } from "@mui/material";
import Grid from "@mui/material/Grid";
import ProductionForm from "src/views/notification/magazine/create/ProductionForm";
import PreviewMailProduction from "src/views/notification/magazine/create/PreviewMailProduction";

import { useState } from "react";

const CreateMailProduction = () => {
  const [toptitle, setTopTitle] = useState("");
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [intro, setIntro] = useState("");

  const getTopTitle = (data) => { // the callback. Use a better name
    setTopTitle(data)
  };
  const getTitle = (data) => { // the callback. Use a better name
    setTitle(data)
  };
  const getSubtitle = (data) => { // the callback. Use a better name
    setSubtitle(data)
  };
  const getIntro = (data) => { // the callback. Use a better name
    setIntro(data)

  };
return (
  <Grid container spacing={6}>
    <Grid item xs={12} md={6}>
      <Card>
        <CardContent>
          <ProductionForm setTopTitle={getTopTitle} setTitle={getTitle} setSubtitle={getSubtitle} setIntro={getIntro}/>
        </CardContent>
      </Card>
    </Grid>
    <Grid item xs={12} md={6}>
      <Card>
        <CardContent>
          <PreviewMailProduction toptitle={toptitle} title={title} subtitle={subtitle} intro={intro}/>
        </CardContent>
      </Card>
    </Grid>
  </Grid>
);
}
export default CreateMailProduction;