import { TMDB_KEY, POCKETBASE_ADMIN_EMAIL, POCKETBASE_ADMIN_PASS } from '$env/static/private';
import { TMDB, type SeasonDetails } from 'tmdb-ts';
import { range } from '$lib/util';
import { pb } from '$lib/pocketbase.js';

export async function load({ params }) {
    const tmdb = new TMDB(TMDB_KEY)

    let media_type = params.media_type
    let mid = params.mid
    let media_data = { }
    let title = ""
    let imgurl = ""
    let summary = ""

    if (media_type == "tv") {
        const series_data = await tmdb.tvShows.details(parseInt(mid))
        title = series_data.name
        imgurl = `https://image.tmdb.org/t/p/w500${series_data.poster_path}`
        summary = series_data.overview
        let season_data = [] as SeasonDetails[]
        if (series_data != undefined) {
            season_data = await Promise.all(range(1, series_data.number_of_seasons).map(async (season_num) => {
                return await tmdb.tvShows.season(parseInt(mid), season_num)
            }))
        }
        media_data = { series_data, season_data }
    } else if (media_type == "movie") {
        const movie_data = await tmdb.movies.details(parseInt(mid))
        title = movie_data.title
        imgurl = `https://image.tmdb.org/t/p/w500${movie_data.poster_path}`
        summary = movie_data.overview
        media_data = { movie_data }
    } else if (media_type == "book") {
        let api_url = `https://openlibrary.org/works/${mid}.json`
        const book_data = await fetch(api_url).then(res => res.json())
        title = book_data.title
        imgurl = book_data.covers && book_data.covers[0] ? `https://covers.openlibrary.org/b/id/${book_data.covers[0]}-L.jpg` : ""
        summary = book_data.description
        media_data = { book_data }
    } else {
        return { mid, media_type }
    }

    await pb.admins.authWithPassword(POCKETBASE_ADMIN_EMAIL, POCKETBASE_ADMIN_PASS)
    
    let mdbid = "";

    let media_db_entries = await pb.collection("media").getFullList({filter: `mid="${mid}"`})
    if (media_db_entries.length == 0) {
        let new_db_entry = await pb.collection("media").create({mid, media_type, title, imgurl, summary})
        mdbid = new_db_entry.id
    } else {
        mdbid = media_db_entries[0].id
    }
    
    return { mdbid, mid, media_type, media_data }
}  