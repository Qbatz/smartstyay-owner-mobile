import { Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

const BASE_WIDTH = 375;
const BASE_HEIGHT = 812;

export const s = (size) => (width / BASE_WIDTH) * size;
export const vs = (size) => (height / BASE_HEIGHT) * size;
