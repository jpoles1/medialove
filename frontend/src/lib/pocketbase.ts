import { PUBLIC_POCKETBASE_URL } from '$env/static/public'
import PocketBase from 'pocketbase'
import { writable } from 'svelte/store'

export const pb = new PocketBase(PUBLIC_POCKETBASE_URL)
export const uaccount = writable(pb.authStore.model)

export interface ViewData {
    id?: string,
    mid: string,
    media_type: string,
    uid?: string,
    season?: number,
    episode?: number,
    page?: number,
    viewed: boolean,
    created?: Date,
    updated?: Date,
}