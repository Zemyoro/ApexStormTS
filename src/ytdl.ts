import { Media } from './platforms';
import progress from 'cli-progress';
import ytdl from 'ytdl-core';
import 'dotenv/config';
import main from '.';
import fs from 'fs';

export default async function (media: Media[]) {
    require('console-clear')(true);
    downloadingLog();

    const format = process.env.DOWNLOAD_TYPE;
    const downloadProgress = new progress.SingleBar({}, progress.Presets.shades_classic);
    const downloadDirectory = `./downloads/${new Date().toLocaleDateString().replaceAll('/', '-')}`;
    if (!fs.existsSync('./downloads')) fs.mkdirSync('./downloads');
    if (!fs.existsSync(downloadDirectory)) fs.mkdirSync(downloadDirectory);

    let total = 0;
    downloadProgress.start(media.length, 0);
    for (const item of media) {
        const stream = ytdl(item.URL, {
            quality: format === 'mp3' ? 'highestaudio' : 'highestvideo'
        }).pipe(fs.createWriteStream(`${downloadDirectory}/${item.title.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '-')}.${format}`));

        stream.on('finish', () => {
            require('console-clear')(true);
            downloadingLog();
            total++;

            downloadProgress.update(total);
            downloadProgress.updateETA();

            if (downloadProgress.getProgress() === 1) {
                downloadProgress.stop();
                require('console-clear')(true);

                console.log('Downloads complete! Returning to main...');
                return setTimeout(() => {
                    main();
                }, 5_000);
            }
        });
    }

    function downloadingLog() {
        console.log(`Downloading ${media.length} item${media.length > 1 ? 's' : ''}`);
        console.log('Listen to https://www.youtube.com/watch?v=dQw4w9WgXcQ while you wait!');
    }
}