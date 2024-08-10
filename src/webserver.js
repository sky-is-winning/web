import express from 'express';
import {publicIpv4} from 'public-ip';
import { EventEmitter } from 'events';
import Game from './game.js';
import WWW from './www.js';

const PUBLIC_IP = await publicIpv4();

export default class WebServer {
    constructor() {
        this.app = express();
        this.events = new EventEmitter();
        this.game = new Game(PUBLIC_IP);
        this.www = new WWW();
    }

    start() {
        const port = process.argv[2] || 80;

        // Handle all GET and POST requests
        this.app.all('*', (req, res, next) => {
            const subdomain = req.headers.host.split('.')[0];
            switch (subdomain) {
                case 'play':
                    this.game.serve('./vanilla-media/play', req, res);
                    break;
                case 'media':
                    this.game.serve('./vanilla-media/media', req, res);
                    break;
                default:
                    this.www.serve(req, res);
                    break;
            }
        });

        this.app.listen(port, () => {
            console.log(`Server running on port ${port}`);
        });
    }
}
