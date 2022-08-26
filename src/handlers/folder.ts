import fs from 'fs';

const folders: folder[] = [
    {
        name: 'downloads'
    }
]

export default () => {
    for (const folder of folders) {
        let directory;

        if (folder.in)
            directory = `./${folder.in.join('/')}/${folder.name}`;
        else directory = `./${folder.name}`;

        if (!fs.existsSync(directory))
            fs.mkdirSync(directory);
    }
}

interface folder {
    name: string,
    in?: string[]
}