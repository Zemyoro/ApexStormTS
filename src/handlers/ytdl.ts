import { Media } from '../platforms';
import folder from './folder';
import ytdl from 'ytdl-core';
import { main } from '..';
import 'dotenv/config';
import fs from 'fs';

export default (media: Media[]) => {
    require('console-clear')(true);
    if (!media.length) {
        console.log('There is no media to download.');
        return setTimeout(() => {
            return main();
        }, 5_000);
    }
    folder();

    console.log(`Downloading ${media.length} item${media.length > 1 ? 's' : ''}...`);
    console.log('Listen to https://www.youtube.com/watch?v=dQw4w9WgXcQ while you wait!');
    const format = process.env.DOWNLOAD_TYPE;
    const directory = `./downloads/${new Date().toLocaleDateString().replaceAll('/', '-')}`;
    if (!fs.existsSync(directory)) fs.mkdirSync(directory);

    let remaining = media.length;
    for (const content of media) {
        const stream = ytdl(content.URL, {
            quality: format === 'mp3' ? 'highestaudio' : 'highestvideo'
        }).pipe(fs.createWriteStream(`${directory}/${content.title.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '-')}.${format}`));

        stream.on('finish', () => {
            console.log(`Downloaded ${content.title}`);
            remaining--;

            if (!remaining) {
                console.log('Finished all items! Returning to main...');
                return setTimeout(() => {
                    return main();
                }, 5_000);
            }
        });
    }
}