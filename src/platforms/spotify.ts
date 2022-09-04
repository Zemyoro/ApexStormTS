// Spotify module
// Created for ApexStorm
// By Zemyoro

import download from '../ytdl';
import search from 'yt-search';
import { Spotify } from '..';
import { get } from 'prompt';
import { Media } from '.';
import main from '..';

export default function () {
    require('console-clear')(true);

    console.log('Provide a Spotify URL');
    return get(['URL'], (err, result: { URL: string }) => {
        return SpotifyProcessor(result.URL);
    });
}

export async function SpotifyProcessor(url: string) {
    console.log('Processing link...');

    // Convert the normal Spotify link to API
    const URL = url
        .replace('https://open', 'https://api')
        .replace('/track', '/v1/tracks')
        .replace('/playlist', '/v1/playlists')
        .replace('/album', '/v1/albums');

    // Spotify request
    const query = await Spotify.request(URL);
    const trackURLs: Media[] = [];
    const tracks: string[] = [];

    if (!query || !query.type) {
        console.log('The provided link is invalid. Returning to main...');
        return setTimeout(() => {
            main();
        }, 5_000);
    }

    console.log(`${query.type.charAt(0).toUpperCase() + query.type.slice(1)} found`);

    switch (query.type) {
        case 'track':
            console.log('Processing track...');
            let track = query.name;

            for (const artist of query.artists) {
                track += ` - ${artist.name}`;
            }

            return tracks.push(track);
        default:
            console.log('Processing tracks...');

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

    for (const track of tracks) {
        const searchQuery = await search(`${track} ${process.env.DOWNLOAD_TYPE === 'mp3' ? 'audio' : 'video'}`);
        if (!searchQuery || !searchQuery.videos.length) {
            console.log(`Wasn't able to locate ${track}`);
        }

        trackURLs.push({
            title: searchQuery.videos[0].title,
            URL: searchQuery.videos[0].url
        });
    }

    return download(trackURLs);
}