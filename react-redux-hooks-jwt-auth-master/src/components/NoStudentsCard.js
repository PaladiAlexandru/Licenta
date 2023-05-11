import React from "react";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";

const NoStudentsCard = () => {
  return (
    <Card style={{ backgroundColor: "orange" }}>
      <CardContent>
        <Typography variant="h5" component="h2">
          No students yet
        </Typography>
      </CardContent>
    </Card>
  );
};

export default NoStudentsCard;

