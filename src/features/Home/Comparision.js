import React from "react";
import ComparisonService from "../../redux/services/ComparisonService";
import {Card, Typography} from "antd";

const Comparison = props => {
  return <div>
    <Typography.Title level={2}>Comparison</Typography.Title>
    {ComparisonService.getAllComparison().map(c => <Card key={c.id}>{c.title}</Card>)}
  </div>

}

export default Comparison;