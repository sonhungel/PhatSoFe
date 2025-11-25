import { baseService } from "./base/baseService";
import type { LoginRequest, LoginResponse } from "../openAPIGenerate";

export async function login(payload: LoginRequest): Promise<LoginResponse> {
  
    const {data} = await baseService.http.post<LoginResponse>('/auth/login', payload);
    // Save token inside BaseService
    baseService.setToken(data.token);

    return data;
}
