import other from './other';
import spotify from './spotify';
import youtube from './youtube';

export default {
    spotify,
    youtube,
    other
}

export interface Media {
    title: string,
    URL: string
}