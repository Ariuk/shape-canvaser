import { Eraser, Line, Polygon, Rectangle } from "../icon";

export default function Controller({ onClear, onSelect, selectedIndex }) {
  const classNames = [
    "p-4 inline-block cursor-pointer",
    "p-4 inline-block cursor-pointer bg-blue-500 rounded",
  ];
  const tools = [
    {
      icon: <Line color={selectedIndex === 0 ? "white" : "#33363F"} />,
      className: classNames[Number(selectedIndex === 0)],
    },
    {
      icon: <Polygon color={selectedIndex === 1 && "white"} />,
      className: classNames[Number(selectedIndex === 1)],
    },
    {
      icon: <Rectangle color={selectedIndex === 2 && "white"} />,
      className: classNames[Number(selectedIndex === 2)],
    },
  ];

  const handleOnSelect = (index) => {
    onSelect(index);
  };

  return (
    <div className="flex justify-center">
      <div className="bg-white inline-flex items-center rounded mb-2">
        {tools.map((tool, index) => (
          <div
            key={index}
            className={tool.className}
            onClick={() => handleOnSelect(index)}
          >
            {tool.icon}
          </div>
        ))}
      </div>
      <div className={classNames[0]} onClick={() => onClear()}>
        <Eraser />
      </div>
    </div>
  );
}
