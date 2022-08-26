// Spotify module for ApexStorm

import { main, spotifyapi } from '..';
import ytdl from '../handlers/ytdl';
import search from 'yt-search';
import { get } from 'prompt';
import { Media } from '.';
import 'dotenv/config';

export default () => {
    require('console-clear')(true);

    return get(['URL'], async (err, result: { URL: string }) => {
        return spotify(result.URL)
    });
}

export async function spotify(url: string) {
    console.log('Processing information...');

    // Convert the normal Spotify link to API compatible
    const URL = (url as string)
        .replace('https://open', 'https://api')
        .replace('/track', '/v1/tracks')
        .replace('/playlist', '/v1/playlists')
        .replace('/album', '/v1/albums');

    // Spotify request with link data
    const query = await spotifyapi.request(URL).catch(() => null);

    // Tracks with song name and artist
    const tracks: string[] = [];

    // If the request failed or came back with invalid data
    // console log and return back to main
    if (!query || !query.type) {
        console.log('Invalid Spotify link provided. Returning to main...');
        return setTimeout(() => {
            return main();
        });
    }

    console.log(`${query.type.charAt(0).toUpperCase() + query.type.slice(1)} found`);
    console.log('Getting tracks...');

    switch (query.type) {
        case 'track':
            let track = query.name;

            for (const artist of query.artists) {
                track += ` - ${artist.name}`;
            }

            tracks.push(track);
            break;
        default:
            for (let track of query.tracks.items) {
                if (query.type === 'playlist')
                    track = track.track;
                let trackQuery = track.name;

                for (const artist of track.artists) {
                    trackQuery += ` - ${artist.name}`;
                }

                tracks.push(trackQuery);
            }
            break;
    }

    const URLTracks: Media[] = [];

    for (const track of tracks) {
        const searchQuery = await search(`${track} ${process.env.DOWNLOAD_TYPE === 'mp3' ? 'audio' : 'video'}`);
        if (!searchQuery || !searchQuery.videos.length) {
            console.log(`Wasn't able to locate ${track}`);
        }

        URLTracks.push({
            title: searchQuery.videos[0].title,
            URL: searchQuery.videos[0].url
        });
    }

    return ytdl(URLTracks);
}