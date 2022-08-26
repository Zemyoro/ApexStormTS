// Other module for ApexStorm

import { getLinks } from 'songlink-api';
import { spotify } from './spotify';
import { youtube } from './youtube';
import { get } from 'prompt';
import { main } from '..';

export default () => {
    require('console-clear')(true);

    return get(['URL'], async (err, result: { URL: string }) => {
        console.log('Processing information...');

        return getLinks({ url: result.URL })
            .then(response => {
                if (response.linksByPlatform.youtube.url) {
                    return youtube([], response.linksByPlatform.youtube.url);
                }

                if (response.linksByPlatform.spotify) {
                    return spotify(response.linksByPlatform.spotify.url);
                }
            })
            .catch(() => {
                console.log('No media found for the provided link!');
                return setTimeout(() => {
                    return main();
                }, 5_000);
            });
    });
}