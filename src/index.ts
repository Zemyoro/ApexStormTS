import platforms from './platforms';
import select from 'cli-select';
import 'dotenv/config';

export default function Main() {
    require('console-clear')(true);

    console.log('Select a platform (Search with YouTube)');

    select({
        values: [
            'YouTube',
            'Spotify',
            'Other'
        ]
    }).then(choice => {
        switch (choice.id) {
            case 0:
                return platforms.youtube();
            case 1:
                return platforms.spotify();
            case 2:
                return platforms.other();
        }
    }).catch(() => process.exit(0));
}

export const Spotify = new (require('node-spotify-api'))({
    id: process.env.SPOTIFY_ID,
    secret: process.env.SPOTIFY_SECRET
})

Main();