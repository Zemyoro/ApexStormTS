import platforms from './platforms';
import cliSelect from 'cli-select';
import 'dotenv/config';

export const main = () => {
    require('console-clear')(true);

    switch (process.env.DOWNLOAD_TYPE) {
        case 'mp3':
            break;
        case 'mp4':
            break;
        default:
            return console.log('Download type has to explicity be mp3 or mp4.');
    }

    cliSelect({
        values: ['Search', 'YouTube', 'Spotify', 'Other'],
        cleanup: true,
        valueRenderer(value) {
            return value;
        }
    }).then((choice) => {
        switch (choice.id) {
            case 0:
                return platforms.youtube();
            case 1:
                return platforms.youtube();
            case 2:
                return platforms.spotify();
            case 3:
                return platforms.other();
        }
    }).catch(() => null);
}

export const spotifyapi = new (require('node-spotify-api'))({
    id: process.env.SPOTIFY_ID,
    secret: process.env.SPOTIFY_SECRET
})

main();