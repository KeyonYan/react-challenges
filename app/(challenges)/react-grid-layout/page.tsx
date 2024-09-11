'use client';
import React, { useState } from "react";
import _ from "lodash";
import RGL, { WidthProvider } from "react-grid-layout";
import "./grid-layout.css";
import "react-resizable/css/styles.css";
import { Card } from "@/components/Card";

const ReactGridLayout = WidthProvider(RGL);

const NoCompactingLayout = (props) => {
  const {
    className = "layout",
    items = 50,
    cols = 12,
    rowHeight = 30,
    onLayoutChange = () => { },
    verticalCompact = false,
    ...otherProps
  } = props;

  const generateLayout = () => {
    return _.map(new Array(items), (item, i) => {
      const y = _.result(props, "y") || Math.ceil(Math.random() * 4) + 1;
      return {
        x: (i * 2) % 12,
        y: Math.floor(i / 6) * y,
        w: 2,
        h: y,
        i: i.toString()
      };
    });
  };

  const [layout, setLayout] = useState(generateLayout());

  const generateDOM = () => {
    return _.map(_.range(items), (i) => (
      <Card key={i}>
        <span className="text">{i}</span>
      </Card>
    ));
  };

  const handleLayoutChange = (newLayout) => {
    onLayoutChange(newLayout);
  };

  return (
    <ReactGridLayout
      layout={layout}
      onLayoutChange={handleLayoutChange}
      className={className}
      cols={cols}
      rowHeight={rowHeight}
      verticalCompact={verticalCompact}
      {...otherProps}
    >
      {generateDOM()}
    </ReactGridLayout>
  );
};

export default NoCompactingLayout;
