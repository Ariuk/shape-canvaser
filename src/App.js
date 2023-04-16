import React from "react";
import JsonEditor from "react-json-editor-ajrm";
import locale from "react-json-editor-ajrm/locale/en";
import { Button } from "antd";

import Canva from "./components/Canva";

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      config: {},
      data: {
        Rectangle: [
          [
            [87, 56],
            [181, 158],
          ],
        ],
        Polygon: [
          [
            [235, 42],
            [157, 199],
            [365, 94],
          ],
        ],
        Line: [
          [
            [68, 50],
            [262, 112],
          ],
          [
            [585, 178],
            [395, 322],
          ],
        ],
      },
      toolIndex: 2,
      width: 0,
      ratio: 0,
    };

    this.containerRef = React.createRef();
    this.jsonRef = React.createRef();
    this.handleOnSave = this.handleOnSave.bind(this);
    this.onConfigChange = this.onConfigChange.bind(this);
  }

  handleOnConfigChange = (config) => {
    this.setState({ config });
  };

  handleOnChange = (data) => {
    const newArray = this.state.data[Object.keys(data)[0]];
    newArray.push(Object.values(data)[0]);
    const newData = { ...this.state.data, [Object.keys(data)[0]]: newArray };
    this.setState({ data: newData, toolIndex: -1 });
  };

  handleOnSelect = (toolIndex) => {
    this.setState({ toolIndex });
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

  componentDidUpdate(prevProps, prevState) {
    const { data } = this.state;
    this.updateWidth();
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

  onConfigChange = (arg) => {
    console.log("arg onConfigChange:>> ", arg);
  };

  handleOnAddShape= (points, shape) => {
    const { data } = this.state;
    const newShapes = data[shape];
    newShapes.push(points);
    this.setState({ data: { ...data,  [shape]: newShapes } });
  };

  handleOnTransform = (points, shape, index) => {
    const { data } = this.state;
    const newShapes = data[shape];
    newShapes[index] = points;
    console.log('newShapes handleOnTransform:>> ', newShapes);
    this.setState({ data: { ...data, [shape]: newShapes } });
  };

  handleOnDelete = (shape, index) => {
    const { data } = this.state;
    const newShapes = data[shape];
    newShapes.splice(index, 1);
    this.setState({ data: { ...data, [shape]: newShapes } });
  };

  handleOnSave = () => {
    console.log(" this.jsonRef.current):>> ", this.jsonRef.current);
  };

  render() {
    const { width, ratio, toolIndex, data } = this.state;
    const jsonKey = Math.random();
    return (
      <div className="flex h-screen flex-row bg-red-300">
        <div className="w-1/2 p-4">
          <JsonEditor
            key={`key-${jsonKey}`}
            placeholder={data} // data to display
            locale={locale}
            ref={this.jsonRef}
            onChange={this.onConfigChange}
            width="100%"
            height="auto"
            colors={{
              string: "white", // overrides theme colors with whatever color value you want
            }}
            confirmGood={false}
          />
          <Button type="primary" onClick={this.handleOnSave}>
            Save
          </Button>
        </div>
        <div ref={this.containerRef} className="w-1/2">
          {!!width && !!ratio && (
            <>
              <Canva
                onSelect={this.handleOnSelect}
                imgSrc={process.env.REACT_APP_DEFAULT_IMG}
                height={width / ratio}
                width={width}
                onAddShape={this.handleOnAddShape}
                onDelete={this.handleOnDelete}
                onTransform={this.handleOnTransform}
                toolIndex={toolIndex}
                source={data}
              />
            </>
          )}
        </div>
      </div>
    );
  }
}

export default App;
