import youtube from './youtube';
import spotify from './spotify';
import other from './other';

export default {
    youtube,
    spotify,
    other
}

export interface Media {
    title: string;
    URL: string;
}