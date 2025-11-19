import { baseService } from "./base/baseService";
import type { LoginRequest, LoginResponse } from "../openAPIGenerate";

export async function login(payload: LoginRequest): Promise<LoginResponse> {

    // 2. Get the full config object
    const config = baseService.getConfig();
    if (config) {
      console.log('App Name:', config.app.name);
      console.log('App Version:', config.app.version);
      console.log('API Base URL from config:', config.api.baseUrl);
    }

    const {data} = await baseService.http.post<LoginResponse>('/auth/login', payload);
    // Save token inside BaseService
    baseService.setToken(data.token);

    return data;
}
