// Other module
// Created for ApexStorm
// By Zemyoro

import { YouTubeProcessor } from './youtube';
import { SpotifyProcessor } from './spotify';
import { getLinks } from 'songlink-api';
import { get } from 'prompt';
import main from '..';

export default function () {
    require('console-clear')(true);

    console.log('Provide a link');
    return get(['URL'], (err, result: { URL: string }) => {
        console.log('Processing link...');

        return getLinks({ url: result.URL })
            .then(response => {
                if (response.linksByPlatform.youtube.url) {
                    return YouTubeProcessor(response.linksByPlatform.youtube.url);
                }

                if (response.linksByPlatform.spotify) {
                    return SpotifyProcessor(response.linksByPlatform.spotify.url);
                }
            })
            .catch(() => {
                console.log('There was no valid media for the provided link! Returning to main...');
                return setTimeout(() => {
                    return main();
                }, 5_000);
            });
    });
}