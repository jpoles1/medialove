<script lang="ts">
	import { pb, uaccount, type ViewData } from "$lib/pocketbase";
	import { Button, Switch, Tab, Tabs } from "svelte-ux";

    export let id: string;
    export let media_data: any;
    export let view_data: ViewData[];

    async function view_update(viewed: boolean) {
        console.log(view_data)
        if (view_data.length == 0) {
            let new_view = { mid: id, media_type: "book", viewed, uid: $uaccount.id } as ViewData
            new_view = await pb.collection("viewlist").create(new_view)
            view_data = [new_view]
        } else {
            console.log(view_data[0].id)
            pb.collection("viewlist").update(view_data[0].id!, { viewed })
        }
    }
    let book_data = media_data.book_data
    
    let show_synopsis = false;
</script>

<div class="p-2">
    <h1>{book_data.title}</h1>
    <div class="w-[200px]">
        {#if book_data && book_data.covers[0]}
            <img src="https://covers.openlibrary.org/a/id/{book_data.covers[0]}-L.jpg?default=false" onerror="this.onerror=null;this.src='/placeholder.png';"/>
        {:else}
            <img src="/placeholder.png"/>
        {/if}
    </div>

    <label class="flex gap-2 items-center text-sm my-2">
        <Switch checked={view_data && view_data[0] ? view_data[0].viewed : false} on:change={(e) => {view_update(e.target.checked)}} />
        Read
    </label>

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