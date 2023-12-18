<script lang="ts">
	import AddToList from "$lib/AddToList.svelte";
	import { debounce } from "$lib/debounce";
	import { pb, uaccount, type ViewData } from "$lib/pocketbase";
	import { toast } from "@zerodevx/svelte-toast";
	import { Button, Switch, Tab, Tabs } from "svelte-ux";
	import type { SeasonDetails, TvShowDetails } from "tmdb-ts";

    export let mid: string;
    export let mdbid: string;
    export let media_data: any;
    export let view_data: ViewData[];

    /**
     * Looks up the ID of a TV episode based on the season and episode numbers.
     * @param {number} season - The season number.
     * @param {number} episode - The episode number.
     * @returns {[number, string | undefined]} - An array containing the index of the view entry and the ID of the episode (if found).
     */
    $: view_id_lookup = (season: number, episode: number): [number, string | undefined] => {
        const view_index = view_data.findIndex((v) => v.season == season && v.episode == episode);
        const view_entry = view_data[view_index];
        return [view_index, view_entry ? view_entry.id || undefined : undefined];
    }

    async function view_update(season: number, episode: number, viewed: boolean) {
        if (!$uaccount) {
            toast.push("You must be logged in to track viewing history", { classes: ["error"] })
            return
        }
        let [view_index, view_id] = view_id_lookup(season, episode);
        if (view_data.length == 0 || !view_id) {
            const new_view = { media: mdbid, season, episode, viewed, uid: $uaccount.id } as ViewData
            const view_record = await pb.collection("viewing").create(new_view).catch((e) => {
                console.error(e)
                toast.push(`Error creating view record: ${e}`, { classes: ["error"] })
            }) as ViewData | undefined
            if (view_record) view_data = [...view_data, view_record]
        } else {
            view_data[view_index].viewed = viewed
            pb.collection("viewing").update(view_id, { viewed }).catch((e) => {
                console.error(e)
                toast.push(`Error updating view record: ${e}`, { classes: ["error"] })
            })
        }
    }

    const view_update_debounce = debounce(view_update, 150, 150)

    let series_data = media_data.series_data as TvShowDetails
    let season_data = media_data.season_data as SeasonDetails[]

    let innerWidth = 1000;
    
    let active_season = 0;
    let active_episode = 0;
    let show_synopsis = false;

    $: active_episode_data = season_data[active_season].episodes[active_episode]
    $: ep_viewed = (season: number, episode: number) => view_data && view_data[view_id_lookup(season, episode)[0]] ? view_data[view_id_lookup(season, episode)[0]].viewed : false
    $: season_viewed_color = (season: number): string => {
        if (!view_data) return ""
        const season_viewed_count = view_data.filter((v) => v.season == season && v.viewed).length
        return season_viewed_count == 0 ? "" : (season_viewed_count == season_data[season-1].episodes.length ? "bg-green-400" : "bg-yellow-400")
    }
    $: active_ep_viewed = view_data && view_data[view_id_lookup(active_season+1, active_episode+1)[0]] ? view_data[view_id_lookup(active_season+1, active_episode+1)[0]].viewed : false
</script>

<svelte:window bind:innerWidth />

<div class="p-2">
    <h1>{series_data.name}</h1>

    <img src="https://image.tmdb.org/t/p/w200/{series_data.poster_path}" onerror="this.onerror=null;this.src='/placeholder.png';" class="mt-2 rounded-lg"/>
    
    <hr>
    
    <label class="flex gap-2 items-center text-sm my-2">
        <Switch checked={ep_viewed(-1, -1)} on:change={(e) => {view_update_debounce(-1, -1, e.target.checked)}} />
        Watched
    </label>
    
    <hr/>
    <div>
        <AddToList mdbid={mdbid} />
    </div>
    <hr/>

    <p class="my-2">
        <b>Overview:</b>
        {series_data.overview}
    </p>
    
    <div>
        <Tabs>
            {#each season_data as season, i}
              <Tab on:click={() => {active_season = i; active_episode=0; show_synopsis=false}} selected={active_season === i} class={season_viewed_color(i+1)}>{season.name}</Tab>
            {/each}
          
            <svelte:fragment slot="content">
                <div class="border-gray-200 border-2 rounded-b p-4">
                    <Tabs placement={innerWidth > 400 ? "left" : "top"}>
                        {#each season_data[active_season].episodes as episode, i}
                            <Tab on:click={() => {active_episode = i; show_synopsis=false}} selected={active_episode === i} class="{ep_viewed(active_season+1, i+1) ? "bg-green-400" : ""}">Episode {i+1}</Tab>
                        {/each}
                        
                        <svelte:fragment slot="content">
                            <div class="border-gray-200 border-2 rounded-b p-4 h-full">
                                <h1>Episode #{active_episode+1} - {active_episode_data.name}</h1>
                                <label class="flex gap-2 items-center text-sm my-2">
                                    <Switch checked={active_ep_viewed} on:change={(e) => {view_update_debounce(active_season+1, active_episode+1, e.target.checked)}} />
                                    Watched
                                </label>
                                <hr>
                                Air Date: {active_episode_data.air_date} | Runtime: {active_episode_data.runtime} min
                                <br>
                                Audience Score: {active_episode_data.vote_average}/10 <span class="italic text-xs">({active_episode_data.vote_count} votes)</span>
                                <br>
                                <hr>
                                <b>Overview:</b>
                                <div>
                                    {#if show_synopsis}
                                        <!-- Warning: Not sanitized -->
                                        {@html active_episode_data.overview.replaceAll("\n\n", "<br>").replaceAll("\n", "<br>")}
                                    {:else}
                                        <Button size="sm" variant="fill-outline" on:click={() => show_synopsis=true}>Show Synopsis (Spoiler Warning)</Button>
                                    {/if}
                                </div>
                            </div>
                        </svelte:fragment>
                    </Tabs>                      
                </div>
            </svelte:fragment>
        </Tabs>
          
    </div>
</div>