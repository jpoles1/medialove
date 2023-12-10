<script lang="ts">
	import { Button, Switch, Tab, Tabs } from "svelte-ux";

    export let id;
    export let media_data: any;
    let book_data = media_data.book_data

    let show_synopsis = false;
</script>

<div class="p-2">
    <h1>{book_data.title}</h1>

    <div class="w-[200px]">
        <img src="https://covers.openlibrary.org/a/id/{book_data.covers[0]}-L.jpg?default=false" onerror="this.onerror=null;this.src='/placeholder.png';"/>
    </div>

    <label class="flex gap-2 items-center text-sm my-2">
        <Switch />
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