/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { VnptDonvi } from '../models/VnptDonvi';
import type { VnptPhatsoCaller } from '../models/VnptPhatsoCaller';
import type { VnptPhatsoPrinter } from '../models/VnptPhatsoPrinter';
import type { VnptPhatsoRoom } from '../models/VnptPhatsoRoom';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ManagementService {
    /**
     * Lấy danh sách đơn vị
     * @returns VnptDonvi OK
     * @throws ApiError
     */
    public static getApiManagementDonvis(): CancelablePromise<Array<VnptDonvi>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/Management/donvis',
        });
    }
    /**
     * Lấy danh sách máy in đã kích hoạt
     * @returns VnptPhatsoPrinter OK
     * @throws ApiError
     */
    public static getApiManagementPrinters(): CancelablePromise<Array<VnptPhatsoPrinter>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/Management/printers',
        });
    }
    /**
     * Lấy danh sách phòng theo đơn vị
     * @param donviId ID đơn vị
     * @returns VnptPhatsoRoom OK
     * @throws ApiError
     */
    public static getApiManagementRoomsDonvi(
        donviId: number,
    ): CancelablePromise<Array<VnptPhatsoRoom>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/Management/rooms/donvi/{donviId}',
            path: {
                'donviId': donviId,
            },
        });
    }
    /**
     * Lấy danh sách caller theo đơn vị
     * @param donviId ID đơn vị
     * @returns VnptPhatsoCaller OK
     * @throws ApiError
     */
    public static getApiManagementCallersDonvi(
        donviId: number,
    ): CancelablePromise<Array<VnptPhatsoCaller>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/Management/callers/donvi/{donviId}',
            path: {
                'donviId': donviId,
            },
        });
    }
    /**
     * Xác thực máy in
     * @param printerId ID máy in
     * @param requestBody Mã xác thực
     * @returns boolean OK
     * @throws ApiError
     */
    public static postApiManagementPrintersVerify(
        printerId: number,
        requestBody?: string,
    ): CancelablePromise<boolean> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/Management/printers/{printerId}/verify',
            path: {
                'printerId': printerId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Xác thực caller
     * @param callerId ID caller
     * @param requestBody Mã xác thực
     * @returns boolean OK
     * @throws ApiError
     */
    public static postApiManagementCallersVerify(
        callerId: number,
        requestBody?: string,
    ): CancelablePromise<boolean> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/Management/callers/{callerId}/verify',
            path: {
                'callerId': callerId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
