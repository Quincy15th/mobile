import { Platform } from "react-native";

// Địa chỉ IP backend từ hình ảnh của bạn
const SERVER_IP = "https://voice-assistant.io.vn";

const BASE_URL = "https://voice-assistant.io.vn";
//Platform.select({
// Nếu backend chạy cổng mặc định (80), không cần thêm :3000
//ios: `https://${SERVER_IP}`,
//android: `https://${SERVER_IP}`,
//default: `https://${SERVER_IP}`,
//});

export default BASE_URL;
