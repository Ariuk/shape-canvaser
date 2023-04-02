const history = {};

function removeLine (data) {
    data.Line.pop();
    let newData = { ...data }
    return newData;
}

function removeProperty (property, data) {
    const { [property]: propertyDeleted, ...newData } = data;
    return newData;
}

history.cancel = (currentProperty, data) => {
    let newData;
    if (currentProperty === 'Line') {
        newData = removeLine(data);
    } else if (currentProperty) {
        newData = removeProperty(currentProperty, data);
    }
    return newData;
}

history.filterPolygon = (data) => {
    return Object.keys(data).reduce((acc, curr) => {
        if (curr.startsWith('Poly')) {
            if (curr.length < 3) {
                return acc;
            }
        }
        acc[curr] = data[curr];
        return acc;
    }, {});
}
export default history;
