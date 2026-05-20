import { systemSettingsApi } from "../infrastructure/system-settings.api";
import { SystemSettings, UpdateSystemSettingsDto } from "../domain/system-settings.types";

export class GetSystemSettingsUseCase {
  async execute(): Promise<SystemSettings> {
    return await systemSettingsApi.getSettings();
  }
}

export class UpdateSystemSettingsUseCase {
  async execute(data: UpdateSystemSettingsDto): Promise<SystemSettings> {
    return await systemSettingsApi.updateSettings(data);
  }
}

export const getSystemSettingsUseCase = new GetSystemSettingsUseCase();
export const updateSystemSettingsUseCase = new UpdateSystemSettingsUseCase();
