import { pb } from '$lib/pocketbase.js'

export async function load({ params }) {
    let id = params.id    
    let list_data = await pb.collection("medialist").getOne(id)

    return { id }
}  