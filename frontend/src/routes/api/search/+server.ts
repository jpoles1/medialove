import { TMDB_KEY } from '$env/static/private';
import { error, json, type RequestEvent } from '@sveltejs/kit';
import { TMDB } from 'tmdb-ts';

export async function POST(req: RequestEvent) {
    let query = await req.request.json()
    console.log(query)
    const tmdb = new TMDB(TMDB_KEY);

    if (query.media_type == "tv") {
        return json(await tmdb.search.tvShows({query: query.search_term, page: query.page || 1}))
    } else if (query.media_type == "movie") {
        return json(await tmdb.search.movies({query: query.search_term, page: query.page || 1}))
    } else if (query.media_type == "book") {
        let api_url = `https://openlibrary.org/search.json?q=title:"${query.search_term}"&page=${query.page || 1}`
        let search_result = await fetch(api_url).then(res => res.json())
        return json(search_result)    
    }
    throw error(400, { message: "Invalid media type" })
}