/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { LoginRequest } from '../models/LoginRequest';
import type { LoginResponse } from '../models/LoginResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AuthService {
    /**
     * Login với username và password để nhận JWT token
     * @param requestBody Thông tin đăng nhập
     * @returns LoginResponse OK
     * @throws ApiError
     */
    public static postApiAuthLogin(
        requestBody?: LoginRequest,
    ): CancelablePromise<LoginResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/Auth/login',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Validate JWT token hiện tại
     * @returns any OK
     * @throws ApiError
     */
    public static getApiAuthValidate(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/Auth/validate',
        });
    }
    /**
     * Get API authentication information
     * @returns any OK
     * @throws ApiError
     */
    public static getApiAuthInfo(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/Auth/info',
        });
    }
}
