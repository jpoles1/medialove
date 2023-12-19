import { PUBLIC_POCKETBASE_URL } from '$env/static/public'
import PocketBase from 'pocketbase'
import { writable } from 'svelte/store'

export const pb = new PocketBase(PUBLIC_POCKETBASE_URL)
export const uaccount = writable(pb.authStore.model)

export type UserID = string
export type MediaID = string
export type MediaListID = string
export type ViewID = string
export type MediaFileID = string

export interface UserData {
    id?: UserID,
    username: string,
    email: string,
    name: string,
    avatar: string,
    created?: Date,
    updated?: Date,
}

export interface MediaData {
    id?: MediaID,
    mid: string,
    media_type: string,
    title: string,
    imgurl: string,
    summary: string,
    media_data: any,
    created?: Date,
    updated?: Date,
}

export interface ViewData {
    id?: ViewID,
    media: MediaID | MediaData,
    uid?: UserID,
    season?: number,
    episode?: number,
    page?: number,
    viewed: boolean,
    created?: Date,
    updated?: Date,
}

export interface MediaList {
    id?: MediaListID,
    name: string,
    creator: UserID,
    editors: UserID[],
    viewers: UserID[],
    public: boolean,
    media: MediaID[],
    expand: {
        media: MediaData[],
    },
    created?: Date,
    updated?: Date,
}

export interface MediaFile {
    id?: MediaFileID,
    user: UserID,
    media: MediaID,
    file: string,
    created?: Date,
    updated?: Date,
}