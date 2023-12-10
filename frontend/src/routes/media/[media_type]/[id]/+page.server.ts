import { TMDB_KEY } from '$env/static/private';
import { TMDB, type SeasonDetails } from 'tmdb-ts';
import { range } from '$lib/util';

export async function load({ params }) {
    const tmdb = new TMDB(TMDB_KEY)

    let media_type = params.media_type
    let id = params.id    
    let media_data = { }

    if (media_type == "tv") {
        let series_data = await tmdb.tvShows.details(parseInt(id))
        let season_data = [] as SeasonDetails[]
        if (series_data != undefined) {
            season_data = await Promise.all(range(1, series_data.number_of_seasons).map(async (season_num) => {
                return await tmdb.tvShows.season(parseInt(id), season_num)
            }))
        }
        media_data = { series_data, season_data }
    } else if (media_type == "movie") {
        let movie_data = await tmdb.movies.details(parseInt(id))
        media_data = { movie_data }
    }
    
    return { id, media_type, media_data }
}  