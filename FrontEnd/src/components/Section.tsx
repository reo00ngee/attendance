import React from "react";
import { Grid, GridProps } from "@mui/material";

type SectionProps = GridProps & {
  children: React.ReactNode;
};

const Section = ({ children, ...props }: SectionProps) => (
  <Grid container spacing={2} sx={{ mt: 2 }} justifyContent="center" {...props}>
    <Grid item xs={12} md={10} lg={8}>
      {children}
    </Grid>
  </Grid>
);

export default Section;