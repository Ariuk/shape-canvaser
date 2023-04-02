import React from "react";
import JsonEditor from "react-json-editor-ajrm";
import locale from "react-json-editor-ajrm/locale/en";

import { DRAW_TOOLS } from "./util.consts";
import Controller from "./components/Controller";
import Canvaser from "./components/Canvaser";

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      config: {},
      data: {
        Line: [],
        Rectangle: [
          [87, 56],
          [87, 158],
          [181, 158],
          [181, 56],
        ],
        Polygon: [
          [144, 42],
          [278, 31],
          [257, 172],
        ],
      },
      toolIndex: 1,
      width: 0,
      ratio: 0,
    };

    this.containerRef = React.createRef();
    this.canvasRef = React.createRef();
  }

  handleOnConfigChange = (config) => {
    this.setState({ config });
  };

  handleOnChange = (data) => {
    //this.setState({ data });
  };

  handleOnClear = () => {
    this.canvasRef.current?.cleanCanvas();
  };

  handleOnSelect = (toolIndex) => {
    this.setState({ toolIndex });
  };

  handleOnFinishDraw = (data) => {
    this.setState({ data });
  };

  componentDidMount() {
    const img = new Image();
    img.src = process.env.REACT_APP_DEFAULT_IMG;
    img.onload = () => {
      this.setState({ ratio: img.width / img.height });
    };
    this.updateWidth();
    window.addEventListener("resize", this.updateWidth);
  }

  componentDidUpdate() {
    this.updateWidth();
    if (!this.canvasMounted && this.canvasRef?.current) {
      //this.canvasRef.current?.cleanCanvas();
      this.setState({ toolIndex: 0 }, () => (this.canvasMounted = true));
    }
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateWidth);
  }

  updateWidth = () => {
    const { width } = this.state;
    if (this.containerRef.current && !width) {
      const { width: containerWidth } =
        this.containerRef.current.getBoundingClientRect();
      this.setState({ width: containerWidth });
    }
  };

  render() {
    const { config, width, ratio, toolIndex, data } = this.state;

    return (
      <div className="flex h-screen flex-row">
        <div className="w-1/2 p-4">
          <JsonEditor
            placeholder={config} // data to display
            locale={locale}
            onChange={this.onConfigChange}
            width="100%"
            height="auto"
            colors={{
              string: "white", // overrides theme colors with whatever color value you want
            }}
            confirmGood={false}
          />
        </div>
        <div ref={this.containerRef} className="w-1/2">
          {!!width && !!ratio && (
            <>
              {this.canvasMounted && (
                <Controller
                  onClear={this.handleOnClear}
                  onSelect={this.handleOnSelect}
                  selectedIndex={toolIndex}
                />
              )}

              <Canvaser
                ref={this.canvasRef}
                imgSrc={process.env.REACT_APP_DEFAULT_IMG}
                height={width / ratio}
                width={width}
                color="yellow"
                tool={DRAW_TOOLS[toolIndex] || DRAW_TOOLS[0]}
                onDataUpdate={this.handleOnChange}
                initialData={data}
              />
            </>
          )}
        </div>
      </div>
    );
  }
}

export default App;
