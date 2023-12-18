<script lang="ts">
	import AddToList from "$lib/AddToList.svelte";
	import { debounce } from "$lib/debounce";
	import { pb, uaccount, type ViewData } from "$lib/pocketbase";
	import { toast } from "@zerodevx/svelte-toast";
	import { Button, Switch, Tab, Tabs } from "svelte-ux";
	import type { MovieDetails, SeasonDetails, TvShowDetails } from "tmdb-ts";

    export let mid: string;
    export let mdbid: string;
    export let media_data: any;
    export let view_data: ViewData[];

    async function view_update(viewed: boolean) {
        if (!$uaccount) {
            toast.push("You must be logged in to track viewing history", { classes: ["error"] })
            return
        }
        if (view_data.length == 0) {
            const new_view = { media: mdbid, viewed, uid: $uaccount.id } as ViewData
            const view_record = await pb.collection("viewing").create(new_view).catch((e) => {
                console.error(e)
                toast.push(`Error creating view record: ${e}`, { classes: ["error"] })
            }) as ViewData | undefined
            if (view_record) view_data = [view_record]
        } else {
            view_data[0].viewed = viewed
            pb.collection("viewing").update(view_data[0].id!, { viewed }).catch((e) => {
                console.error(e)
                toast.push(`Error updating view record: ${e}`, { classes: ["error"] })
            })
        }
    }
    
    const view_update_debounce = debounce(view_update, 500, 500)

    let movie_data = media_data.movie_data as MovieDetails
    let show_synopsis = false;
</script>

<div class="p-2">
    <h1>{movie_data.title}</h1>

    <img src="https://image.tmdb.org/t/p/w200/{movie_data.poster_path}" onerror="this.onerror=null;this.src='/placeholder.png';" class="mt-2 rounded-lg"/>
    <hr/>
    <label class="flex gap-2 items-center text-sm my-2">
        <Switch checked={view_data && view_data[0] ? view_data[0].viewed : false} on:change={(e) => {view_update_debounce(e.target.checked)}} />
        Watched
    </label>
    <hr/>
    <div>
        <AddToList mdbid={mdbid} />
    </div>
    <hr/>
    <p class="my-2">
        <b>Overview:</b>
        <br>
        {#if show_synopsis}
            <!-- Warning: Not sanitized -->
            {@html movie_data.overview.replaceAll("\n\n", "<br>").replaceAll("\n", "<br>")}
        {:else}
            <Button size="sm" variant="fill-outline" on:click={() => show_synopsis=true}>Show Synopsis (Spoiler Warning)</Button>
        {/if}
    </p>
</div>