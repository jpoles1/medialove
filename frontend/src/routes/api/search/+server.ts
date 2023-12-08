import { TMDB_KEY } from '$env/static/private';
import { json, type RequestEvent } from '@sveltejs/kit';

export async function POST(req: RequestEvent) {
    let user_query = await req.request.json()
    let api_url = `http://api.themoviedb.org/3/search/multi?api_key=${TMDB_KEY}&query=${user_query.query}&page=${user_query.page || 1}`
    let search_res = await fetch(api_url).then(res => res.json())
    console.log(TMDB_KEY)
    return json({ search_res })
}