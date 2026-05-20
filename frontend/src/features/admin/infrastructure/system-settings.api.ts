import api from "@/lib/axios";
import { SystemSettings, UpdateSystemSettingsDto } from "../domain/system-settings.types";

export const systemSettingsApi = {
  getSettings: async (): Promise<SystemSettings> => {
    try {
      const response = await api.get("/admin/settings");
      return response.data;
    } catch (error) {
      // Fallback for development if API is not yet implemented
      console.warn("System Settings API not found, using fallback data", error);
      return {
        siteName: "NexLearn",
        siteDescription: "Advanced E-learning Platform",
        contactEmail: "support@nexlearn.com",
        contactPhone: "+1 (555) 000-0000",
        address: "123 Education Street, Learning City",
        maintenanceMode: false,
        allowRegistration: true,
        defaultLanguage: "en",
        socialLinks: {
          facebook: "https://facebook.com/nexlearn",
          twitter: "https://twitter.com/nexlearn",
        },
        seo: {
          metaTitle: "NexLearn - Empower Your Future",
          metaDescription: "The best place to learn and teach online.",
          keywords: ["elearning", "courses", "education"],
        }
      };
    }
  },

  updateSettings: async (data: UpdateSystemSettingsDto): Promise<SystemSettings> => {
    const response = await api.patch("/admin/settings", data);
    return response.data;
  },
};
