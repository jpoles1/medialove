<script lang="ts">
	import { onMount } from "svelte";
	import { pb, type MediaList, uaccount, type MediaListID } from "./pocketbase";
	import { Button, SelectField } from "svelte-ux";
	import { toast } from "@zerodevx/svelte-toast";
	import type { Media } from "tmdb-ts";

    export let mdbid: string;

    let media_lists = [] as MediaList[];
    let add_lists = [] as any;
    let selected_list = 0;

    let add_to_list = async () => {
        if (!$uaccount) {
            toast.push("You must be logged in to add to a list", { classes: ["error"] })
            return
        }
        if (selected_list == -1) {
            let new_list_name = prompt("Enter new list name:")
            if (!new_list_name) return
            let new_list: MediaList = { name: new_list_name, creator: $uaccount.id, editors: [], viewers: [], media: [mdbid], public: false }
            const new_list_record = await pb.collection("medialist").create(new_list).catch((e) => {
                console.error(e)
                toast.push(`Error creating list: ${e}`, { classes: ["error"] })
            }) as MediaList | undefined
            if (!new_list_record) return
            media_lists = [...media_lists, new_list_record]
            selected_list = add_lists.length - 1
        } else {
            let active_list = add_lists[selected_list]
            active_list.media.push(mdbid)
            await pb.collection("medialist").update(active_list.id, {media: active_list.media}).then(() => {
                media_lists[media_lists.findIndex((l: MediaList) => l.id == active_list.id)] = active_list
                toast.push(`Added to list: ${active_list.name}`, { classes: ["success"] })
            }).catch((e) => {
                console.error(e)
                toast.push(`Error adding to list: ${e}`, { classes: ["error"] })
            })
        }
    }

    let remove_from_list = async (lid: MediaListID) => {
        if (!$uaccount) {
            toast.push("You must be logged in to remove from a list", { classes: ["error"] })
            return
        }
        let active_list_i = current_lists.findIndex((l: MediaList) => l.id == lid)
        if (active_list_i == -1) return
        let active_list = current_lists[active_list_i]
        console.log(active_list)
        active_list.media = active_list.media.filter((m: string) => m != mdbid)
        current_lists = current_lists.filter((l: MediaList) => l.id != lid)
        await pb.collection("medialist").update(lid, {media: active_list.media}).then(() => {
            toast.push(`Removed from list: ${active_list.name}`, { classes: ["success"] })
            media_lists[media_lists.findIndex((l: MediaList) => l.id == lid)] = active_list
        }).catch((e) => {
            console.error(e)
            toast.push(`Error removing from list: ${e}`, { classes: ["error"] })
        })
    }
    
    onMount(async () => {
        media_lists = await pb.collection("medialist").getFullList() as MediaList[]
        if (!media_lists.some((l: any) => l.name == "To View")) {
            const new_list: MediaList = { name: "To View", creator: $uaccount.id, editors: [], viewers: [], media: [], public: false }
            const new_list_record = await pb.collection("medialist").create(new_list).catch((e) => {
                console.error(e)
                toast.push(`Error creating list: ${e}`, { classes: ["error"] })
            }) as MediaList | undefined
            if (!new_list_record) return
            media_lists.push(new_list_record)
        }
        add_lists.push()
    })
    // Lists to which the current media is already added
    $: current_lists = media_lists.filter((l: MediaList) => l.media.includes(mdbid))
    // Lists to which the current media can be added
    $: add_lists = [{ name: "Add New list", value: -1 }, ...media_lists.filter((l: MediaList) => !l.media.includes(mdbid)).map((l: MediaList, i: number) => { return { name: l.name, value: i+1, id: l.id, media: l.media } })]
</script>

<div class="flex">
    <SelectField label="Add to list" options={add_lists} bind:value={selected_list} />
    <Button on:click={add_to_list} variant="fill">+</Button>
</div>

<div class="mt-2">
    <b>Current Lists:</b>
    <div class="flex">
        {#each current_lists as list, i}
            <div class="pl-2 rounded-lg bg-gray-200">
                {list.name}
                <Button on:click={() => {remove_from_list(list.id)}} variant="fill">X</Button>
            </div>
        {/each}
    </div>
</div>