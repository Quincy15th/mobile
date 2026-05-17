import axios from "axios";
import { Platform } from "react-native";
import BASE_URL from "./apiConfig";

const API_URL = `${BASE_URL}/api/assistant`;

const chatService = {
  sendMessage: async (message, token) => {
    try {
      const response = await axios.post(
        `${API_URL}/chat`,
        { message, platform: "mobile" },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      return response.data;
    } catch (error) {
      if (error.response) {
        throw error.response.data;
      }
      throw { message: "Không thể kết nối tới Server" };
    }
  },

  sendVoiceMessage: async (audioUri, token) => {
    try {
      const formData = new FormData();

      // Xử lý URI cho Android (cần prefix file:// nếu chưa có)

      const uri =
        Platform.OS === "android" && !audioUri.startsWith("file://")
          ? `file://${audioUri}`
          : audioUri;

      formData.append("audio", {
        uri: uri,
        type: "audio/m4a",
        name: "audio.m4a",
      });

      formData.append("platform", "mobile");

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 giây timeout

      const response = await fetch(`${API_URL}/voice-chat`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        body: formData,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const data = await response.json();
      if (!response.ok) {
        throw data;
      }
      return data;
    } catch (error) {
      if (
        error &&
        error.message &&
        typeof error.message === "string" &&
        !error.message.includes("Không thể xử lý")
      ) {
        throw error;
      }
      if (error && error.response) {
        throw error.response.data;
      }
      throw { message: "Không thể xử lý giọng nói" };
    }
  },

  getSpeechUrl: () => {
    return `${API_URL}/speak`;
  },

  getHistory: async (token) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/history`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      if (error.response) {
        throw error.response.data;
      }
      throw { message: "Không thể tải lịch sử trò chuyện" };
    }
  },

  checkDueReminders: async (token) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/reminders/due`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      return [];
    }
  },

  acknowledgeReminder: async (id, token) => {
    try {
      await axios.post(
        `${BASE_URL}/api/reminders/${id}/acknowledge`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      return true;
    } catch (error) {
      return false;
    }
  },
};

export default chatService;
