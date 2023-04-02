import { render } from "@testing-library/react";
import React, { useState, useEffect, useLayoutEffect } from "react";
import Canvas from "react-canvas-polygons";
import JsonEditor from "react-json-editor-ajrm";
import locale from "react-json-editor-ajrm/locale/en";

import { DRAW_TOOLS } from "./util.consts";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      width: 0,
      ratio: 0,
      toolIndex: 0,
    };
    this.containerRef = React.createRef();
    this.canvasRef = React.createRef();
  }

  handleOnConfigChange = (config) => {
    this.setState({ config });
  };

  handleOnChange = (data) => {
    this.setState({ data });
  };

  componentDidMount() {
    const { image } = this.props;
    const { width } = this.state;
    const img = new Image();
    img.src = process.env.REACT_APP_DEFAULT_IMG;
    img.onload = () => {
      const ratio = img.width / img.height;
      this.setState({ ratio });
    };
    console.log("this.containerRef.current :>> ", this.containerRef.current);
    if (this.containerRef.current && !width) {
      const { width: containerWidth } =
        this.containerRef.current?.getBoundingClientRect();
      console.log("containerWidth :>> ", containerWidth);
      this.setState({ width: containerWidth });
    }
  }

  componentDidUpdate() {
    const { width } = this.state;
    console.log("width componentDidUpdate:>> ", width);
    if (this.containerRef.current && !width) {
      const { width: containerWidth } =
        this.containerRef.current?.getBoundingClientRect();
      console.log("containerWidth :>> ", containerWidth);
      this.setState({ width: containerWidth });
    }
  }

  render() {
    const { config, width, ratio, toolIndex, data } = this.state;
    console.log("width :>> ", width);
    console.log("ratio :>> ", ratio);
    return (
      <div className="flex h-screen">
        <div className="w-1/2">
        <JsonEditor
          placeholder={config} // data to display
          locale={locale}
          onChange={this.onConfigChange}
          width="100%"
          height="auto"
          colors={{
            string: "#DAA520", // overrides theme colors with whatever color value you want
          }}
          confirmGood={false}
        />
        </div>
       
        <div ref={this.containerRef} className="bg-red-500 w-1/2">
          {!!width && !!ratio && (
            <Canvas
              ref={this.canvasRef}
              imgSrc={process.env.REACT_APP_DEFAULT_IMG}
              height={width / ratio}
              width={width}
              color="red"
              tool={DRAW_TOOLS[toolIndex] || DRAW_TOOLS[0]}
              onDataUpdate={this.handleOnChange}
              initialData={data}
            />
          )}
        </div>
      </div>
    );
  }
}

export default App;
