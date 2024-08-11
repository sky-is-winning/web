import express from 'express';
import { publicIpv4 } from 'public-ip';
import { EventEmitter } from 'events';
import Game from './game.js';
import WWW from './www.js';
import https from 'https';
import fs from 'fs';

const PUBLIC_IP = await publicIpv4();

export default class WebServer {
    constructor() {
        this.app = express();
        this.events = new EventEmitter();
        this.game = new Game(PUBLIC_IP);
        this.www = new WWW();
    }

    start() {
        const doHTTPS = fs.existsSync('/etc/letsencrypt/live/cphistory.pw/privkey.pem') && fs.existsSync('/etc/letsencrypt/live/cphistory.pw/fullchain.pem');
        const port = process.argv[2] || (doHTTPS ? 443 : 80);
        
        if (doHTTPS) {
            const options = {
                key: fs.readFileSync('/etc/letsencrypt/live/cphistory.pw/privkey.pem'),
                cert: fs.readFileSync('/etc/letsencrypt/live/cphistory.pw/fullchain.pem'),
            };

            // Create HTTPS server
            const server = https.createServer(options, this.app);

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

            server.listen(port, () => {
                console.log(`HTTPS Server running on port ${port}`);
            });
        } else {
            // Fallback to HTTP server (optional)
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
                console.log(`HTTP Server running on port ${port}`);
            });
        }
    }
}
