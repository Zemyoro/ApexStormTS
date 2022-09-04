// YouTube module
// Created for ApexStorm
// By Zemyoro

import select from 'cli-select';
import download from '../ytdl';
import search from 'yt-search';
import ytdl from 'ytdl-core';
import { get } from 'prompt';
import { Media } from '.';
import Main from '..';

export default function () {
    require('console-clear')(true);

    console.log('Provide a YouTube URL or search query');
    return get(['Query'], (err, result: { Query: string }) => {
        return YouTubeProcessor(result.Query);
    });
}

export async function YouTubeProcessor(query: string) {
    console.log('Processing query...');
    const media: Media[] = [];

    if (ytdl.validateURL(query) && query.includes('watch?v=')) {
        const video = await search({ videoId: query.split('watch?v=')[1] });
        if (!video) {
            console.log('The provided video doesn\'t exist');
            return setTimeout(() => {
                Main();
            });
        }

        media.push({
            title: video.title,
            URL: query
        });
    } else if (query.includes('playlist?list=')) {
        const playlist = await search({ listId: query.split('playlist?list=')[1] });
        if (!playlist || !playlist.videos.length) {
            console.log('Provided playlist doesn\'t exist or contains no media');
            return setTimeout(() => {
                Main();
            }, 5_000);
        }
        console.log(playlist.videos.length);

        const playlistItems = playlist.videos
            .slice(0, playlist.videos.length > 100 ? 99 : playlist.videos.length);
        for (const item of playlistItems) {
            media.push({
                title: item.title,
                URL: `https://youtube.com/watch?v=${item.videoId}`
            });
        }
    } else {
        require('console-clear')(true);
        console.log('Searching...');

        // Values will store
        // - Video title
        // - Video author
        const values: string[] = [];
        const searchItems = await search({ search: query });
        if (!searchItems || !searchItems.videos.length) {
            console.log('This search did not have any media');
            return setTimeout(() => {
                Main();
            }, 5_000);
        }

        for (const i in searchItems.videos) {
            values.push(`${searchItems.videos[i].title} by ${searchItems.videos[i].author.name}`);
            if (parseInt(i) === 9) break;
        }

        require('console-clear')(true);
        console.log('Select result to download');

        return select({
            values
        }).then(choice => {
            media.push({
                title: searchItems.videos[parseInt(`${choice.id}`)].title,
                URL: searchItems.videos[parseInt(`${choice.id}`)].url
            });

            return download(media);
        }).catch(() => process.exit(0));
    }

    return download(media);
}