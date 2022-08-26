// YouTube module for ApexStorm

import ytdlHandler from '../handlers/ytdl';
import search from 'yt-search';
import ytdl from 'ytdl-core';
import { get } from 'prompt';
import { main } from '..';
import { Media } from '.';

export default async () => {
    require('console-clear')(true);

    const media: Media[] = [];
    return get(['URL'], async (err, result: { URL: string }) => {
        return youtube(media, result.URL);
    });
}

export async function youtube(media: Media[], URL: string) {
    console.log('Processing information...');

    if (ytdl.validateURL(URL) && URL.includes('watch?v=')) {
        const videoMedia = await search({ videoId: URL.split('watch?v=')[1] });
        if (!videoMedia) {
            console.log('Video does not exist.');
            return setTimeout(() => {
                return main();
            }, 5_000);
        }

        media.push({
            title: videoMedia.title,
            URL: URL
        });
    } else if (URL.includes('playlist?list=')) {
        const playlistMedia = await search({ listId: URL.split('playlist?list=')[1] });
        if (!playlistMedia || !playlistMedia.videos.length) {
            console.log('Playlist does not exist or does not contain any media.');
            return setTimeout(() => {
                return main();
            }, 5_000);
        }

        const playlistVideos = playlistMedia.videos.slice(0, playlistMedia.videos.length >= 100 ? 100 : playlistMedia.videos.length - 1);
        for (const video of playlistVideos) {
            media.push({
                title: video.title,
                URL: `https://youtube.com/watch?v=${video.videoId}`
            });
        }
    } else {
        console.log('Attempting search...');

        const searchMedia = await search({ search: URL });
        if (!searchMedia || !searchMedia.videos.length) {
            console.log('This search does not have any valid media.');
            return setTimeout(() => {
                return main();
            }, 5_000);
        }

        media.push({
            title: searchMedia.videos[0].title,
            URL: searchMedia.videos[0].url
        });
    }

    return ytdlHandler(media)
}