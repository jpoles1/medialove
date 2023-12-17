import { PUBLIC_POCKETBASE_URL } from '$env/static/public'
import PocketBase from 'pocketbase'
import { writable } from 'svelte/store'

export const pb = new PocketBase(PUBLIC_POCKETBASE_URL)
export const uaccount = writable(pb.authStore.model)

export interface MediaData {
    id?: string,
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
    id?: string,
    media: string | MediaData,
    uid?: string,
    season?: number,
    episode?: number,
    page?: number,
    viewed: boolean,
    created?: Date,
    updated?: Date,
}

export interface MediaList {
    id?: string,
    name: string,
    creator: string,
    editors: string[],
    viewers: string[],
    public: boolean,
    created?: Date,
    updated?: Date,
}

export interface MediaListEntry {
    id?: string,
    media: string | MediaData,
    list: string | MediaList,
    created?: Date,
    updated?: Date,
}