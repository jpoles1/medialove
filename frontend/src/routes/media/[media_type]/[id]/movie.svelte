<script lang="ts">
	import { Button, Switch, Tab, Tabs } from "svelte-ux";
	import type { MovieDetails, SeasonDetails, TvShowDetails } from "tmdb-ts";

    export let id;
    export let media_data: any;
    let movie_data = media_data.movie_data as MovieDetails

    let show_synopsis = false;
</script>

<div class="p-2">
    <h1>{movie_data.title}</h1>

    <img src="https://image.tmdb.org/t/p/w200/{movie_data.poster_path}" onerror="this.onerror=null;this.src='/placeholder.png';" class="mt-2 rounded-lg"/>
    
    <label class="flex gap-2 items-center text-sm my-2">
        <Switch />
        Watched
    </label>

    <p class="my-2">
        <b>Overview:</b>
        {movie_data.overview}
    </p>
</div>