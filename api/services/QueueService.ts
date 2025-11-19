/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CallQueueRequest } from '../models/CallQueueRequest';
import type { CallQueueResponse } from '../models/CallQueueResponse';
import type { GetRoomsResponse } from '../models/GetRoomsResponse';
import type { InsertQueueRequest } from '../models/InsertQueueRequest';
import type { InsertQueueResponse } from '../models/InsertQueueResponse';
import type { WaitingQueueRequest } from '../models/WaitingQueueRequest';
import type { WaitingQueueResponse } from '../models/WaitingQueueResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class QueueService {
    /**
     * Tạo số thứ tự mới
     * @param requestBody Thông tin tạo số
     * @returns InsertQueueResponse OK
     * @throws ApiError
     */
    public static postApiQueueInsert(
        requestBody?: InsertQueueRequest,
    ): CancelablePromise<InsertQueueResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/Queue/insert',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Gọi số thứ tự
     * @param requestBody Thông tin gọi số
     * @returns CallQueueResponse OK
     * @throws ApiError
     */
    public static postApiQueueCall(
        requestBody?: CallQueueRequest,
    ): CancelablePromise<CallQueueResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/Queue/call',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Lấy danh sách số đang chờ
     * @param requestBody Thông tin caller
     * @returns WaitingQueueResponse OK
     * @throws ApiError
     */
    public static postApiQueueWaiting(
        requestBody?: WaitingQueueRequest,
    ): CancelablePromise<WaitingQueueResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/Queue/waiting',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Lấy danh sách phòng theo máy in
     * @param printerId ID máy in
     * @returns GetRoomsResponse OK
     * @throws ApiError
     */
    public static getApiQueueRooms(
        printerId: number,
    ): CancelablePromise<GetRoomsResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/Queue/rooms/{printerId}',
            path: {
                'printerId': printerId,
            },
        });
    }
}
