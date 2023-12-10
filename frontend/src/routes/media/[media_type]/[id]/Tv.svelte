<script lang="ts">
	import { Button, Switch, Tab, Tabs } from "svelte-ux";
	import type { SeasonDetails, TvShowDetails } from "tmdb-ts";

    export let id;
    export let media_data: any;
    let series_data = media_data.series_data as TvShowDetails
    let season_data = media_data.season_data as SeasonDetails[]

    let innerWidth = 1000;
    
    let active_season = 0;
    let active_episode = 0;
    let show_synopsis = false;

    $: active_episode_data = season_data[active_season].episodes[active_episode]
</script>

<svelte:window bind:innerWidth />

<div class="p-2">
    <h1>{series_data.name}</h1>

    <img src="https://image.tmdb.org/t/p/w200/{series_data.poster_path}" onerror="this.onerror=null;this.src='/placeholder.png';" class="mt-2 rounded-lg"/>
    
    <p class="my-2">
        <b>Overview:</b>
        {series_data.overview}
    </p>
    
    <div>
        <Tabs>
            {#each season_data as season, i}
              <Tab on:click={() => {active_season = i; active_episode=0; show_synopsis=false}} selected={active_season === i}>{season.name}</Tab>
            {/each}
          
            <svelte:fragment slot="content">
                <div class="border-gray-200 border-2 rounded-b p-4">
                    <Tabs placement={innerWidth > 400 ? "left" : "top"}>
                        {#each season_data[active_season].episodes as episode, i}
                            <Tab on:click={() => {active_episode = i; show_synopsis=false}} selected={active_episode === i}>Episode {i+1}</Tab>
                        {/each}
                        
                        <svelte:fragment slot="content">
                            <div class="border-gray-200 border-2 rounded-b p-4 h-full">
                                <h1>Episode #{active_episode+1} - {active_episode_data.name}</h1>
                                <label class="flex gap-2 items-center text-sm">
                                    <Switch />
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