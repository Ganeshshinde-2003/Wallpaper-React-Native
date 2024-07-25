import { Dimensions } from "react-native";

const { width: deviceWidth, height: deviceHeight } = Dimensions.get('window');

export const wp = (percentage) => {
    const width = deviceWidth;
    return (percentage * width) / 100;
}

export const hp = (percentage) => {
    const height = deviceHeight;
    return (percentage * height) / 100;
}

export const getColumns = () => {
    if(deviceWidth >= 1024) return 4;
    else if (deviceWidth >= 768) return 3;
    else return 2;
}

export const getImageSize = (height, width) => {
    if(width>height){
        return 250;
    } else if (width < height) {
        return 300;
    } else {
        return 200;
    }
}