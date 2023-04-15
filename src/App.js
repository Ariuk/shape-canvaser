import React from "react";
import JsonEditor from "react-json-editor-ajrm";
import locale from "react-json-editor-ajrm/locale/en";

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
            [144, 42],
            [278, 31],
            [257, 172],
          ],
        ],
        Line: [
          [
            [50, 50],
            [244, 112],
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

  onConfigChange = (arg) => {};

  handleOnAddRectangle = (rectangle) => {
    const { data } = this.state;
    const newRectangles = data.Rectangle;
    newRectangles.push(rectangle);
    this.setState({ data: { ...data, Rectangle: newRectangles } });
  };

  handleOnTransform = (points, shape, index) => {
    const { data } = this.state;
    const newShapes = data[shape];
    newShapes[index] = points;
    this.setState({ data: { ...data, [shape]: newShapes } });
  };

  handleOnDelete = (shape, index) => {
    const { data } = this.state;
    const newShapes = data[shape];
    newShapes.splice(index, 1);
    this.setState({ data: { ...data, [shape]: newShapes } });
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
        </div>
        <div ref={this.containerRef} className="w-1/2">
          {!!width && !!ratio && (
            <>
              <Canva
                onSelect={this.handleOnSelect}
                imgSrc={process.env.REACT_APP_DEFAULT_IMG}
                height={width / ratio}
                width={width}
                onAddRectangle={this.handleOnAddRectangle}
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
