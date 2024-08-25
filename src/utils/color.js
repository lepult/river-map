

export const getRiverColor = (
    objId,
    selectedObjId,
    gwk,
    selectedGwk,
    hoveredGwk,
    inputGWK,
    objType
) => {
    const gwkArray = `${gwk || ''}`;
    const selectedGwkArray = `${selectedGwk || ''}`;

    // Selected ObjId
    if (objId && objId === selectedObjId) {
        return [0, 255, 0];
    }
    // Selected GWK
    if (gwk && gwk === selectedGwk) {
        return [0, 150, 0];
    }
    // Selected River Basin
    if (gwkArray[0] && gwkArray[0] === selectedGwkArray[0]) {
        return [0, 50, 0];
    }

    // Input GWK
    if (gwk && gwk === inputGWK) {
        return [0, 0, 0];
    }

    // Hovered GWK
    if (gwk && gwk === hoveredGwk) {
        return [0, 0, 255];
    }


    switch (gwkArray[0]) {
        case "1":
            return [198,113,113];
        case "2":
            return [255, 204, 0];
        case "3":
            return [193,39,45];
        case "4":
            return [135, 206, 235];
        case "5":
            return [150, 123, 182];
        case "6":
            return [210,180,140];
        case "7":
            return [255,127,80];
        case "8":
            return [255,182,193];
        case "9":
            if (gwkArray[1] === "2") {
                return [77,77,255];
            }
            return [123,63,0];
        default:
            return [0,105,148];
    }
};
