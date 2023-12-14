<script lang="ts">
	import { debounce } from "$lib/debounce";
	import { pb, uaccount, type ViewData } from "$lib/pocketbase";
	import { toast } from "@zerodevx/svelte-toast";
	import { Button, NumberStepper, Switch, Tab, Tabs } from "svelte-ux";

    export let mid: string;
    export let mdbid: string;
    export let media_data: any;
    export let view_data: ViewData[];

    async function view_update(viewed: boolean, page: number) {
        if (!$uaccount) {
            toast.push("You must be logged in to track viewing history", { classes: ["error"] })
            return
        }
        if (view_data.length == 0) {
            const new_view = { media: mdbid, viewed, page, uid: $uaccount.id } as ViewData
            const view_record = await pb.collection("viewing").create(new_view).catch((e) => {
                console.error(e)
                toast.push(`Error creating view record: ${e}`, { classes: ["error"] })
            }) as ViewData | undefined
            if (view_record) view_data = [view_record]
        } else {
            view_data[0].viewed = viewed
            view_data[0].page = page
            pb.collection("viewing").update(view_data[0].id!, { viewed, page }).catch((e) => {
                console.error(e)
                toast.push(`Error updating view record: ${e}`, { classes: ["error"] })
            })
        }
    }
    const view_update_debounce = debounce(view_update, 500, 500)

    let book_data = media_data.book_data
    let show_synopsis = false;
</script>

<div class="p-2">
    <h1>{book_data.title}</h1>
    <div class="w-[200px]">
        {#if book_data && book_data.covers && book_data.covers[0]}
            <img src="https://covers.openlibrary.org/a/id/{book_data.covers[0]}-L.jpg?default=false" onerror="this.onerror=null;this.src='/placeholder.png';"/>
        {:else}
            <img src="/placeholder.png"/>
        {/if}
    </div>
    <div class="mt-2">
        <div class="flex items-center space-x-2">
            <span>Page:</span>
            <NumberStepper class="w-32" min={0} max={book_data.number_of_pages*20} value={view_data && view_data[0] ? view_data[0].page : 0} on:change={(e) => {view_update_debounce(view_data && view_data[0] ? view_data[0].viewed : false, e.detail.value)}} /></div>
        <label class="flex gap-2 items-center text-sm my-2">
            <Switch checked={view_data && view_data[0] ? view_data[0].viewed : false} on:change={(e) => {view_update_debounce(e.target.checked, view_data && view_data[0] ? view_data[0].page || 0 : 0)}} />
            Read
        </label>
    </div>

    <p class="my-2">
        <b>Overview:</b>
        <br>
        {#if show_synopsis}
            <!-- Warning: Not sanitized -->
            {@html book_data.description}
        {:else}
            <Button size="sm" variant="fill-outline" on:click={() => show_synopsis=true}>Show Synopsis (Spoiler Warning)</Button>
        {/if}
    </p>
</div>