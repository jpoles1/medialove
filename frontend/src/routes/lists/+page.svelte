<script lang="ts">
	import { pb, type MediaList } from "$lib/pocketbase";
	import { onMount } from "svelte";
	import { Button } from "svelte-ux";

    let lists: MediaList[]
    let active_list: number | undefined  = undefined;

    onMount(async () => {
        lists = (await pb.collection("medialist").getFullList({expand: "media"}))
        console.log(lists[0])
    })
</script>

<h1>Media Lists:</h1>
<hr/>
{#if lists}
    {#each lists as list, i}
        <Button variant="fill" on:click="{() => {active_list=i}}">{list.name}</Button>
    {/each}
{/if}
<hr/>
{#if active_list != undefined}
    <b>Media:</b>
    <div class="flex flex-row flex-wrap items-stretch justify-around space-x-2 space-y-2">
        {#each lists[active_list].expand.media as m}
            <div class="p-2 rounded shadow-md">
                <a href="/media/{m.media_type}/{m.mid}" class="w-[200px] flex justify-center items-center flex-col text-center">
                    <div class="w-[200px]">
                        {#if m.imgurl}
                            <img src="{m.imgurl}" onerror="this.onerror=null;this.src='/placeholder.png';"/>
                        {:else}
                            <img src="/placeholder.png"/>
                        {/if}
                    </div>
                    <h2>{m.title}</h2>
                </a>
            </div>
        {/each}
    </div>
{:else}
<i>Select a list above to see media...</i>
{/if}