import { TMDB_KEY } from '$env/static/private';
import { error, json, type RequestEvent } from '@sveltejs/kit';

export async function POST(req: RequestEvent) {
    let query = await req.request.json()
    console.log(query)
    if (["tv", "movie"].includes(query.media_type)) {
        let api_url = `http://api.themoviedb.org/3/search/${query.media_type}?api_key=${TMDB_KEY}&query=${query.search_term}&page=${query.page || 1}`
        let search_result = await fetch(api_url).then(res => res.json())
        return json(search_result)    
    }
    throw error(400, { message: "Invalid media type" })
}