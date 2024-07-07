import express from 'express';
import {publicIpv4} from 'public-ip';
import fs from 'fs';
import mime from 'mime-types';
import { EventEmitter } from 'events';
import raw from 'raw-body';

const FORWARD_TO_DASH = {
    "/penguin/create": "create/vanilla/$lang",
    "/penguin/activate": "activate/vanilla/$lang",
    "/penguin/forgot-password": "password/$lang",
    "/avatar/": "avatar/$user?$args",
    "/web-service/snfgenerator/session": "session",
    "/api/v0.2/xxx/game/get/world-name-service/start_world_request": "swrequest?$args",
    "/manager": "manager",
    "/social/autocomplete/v2/search/suggestions": "autocomplete?$args"
};

const DASH_URL = "http://localhost:3000";

const PUBLIC_IP = await publicIpv4();

export default class WebServer {
    constructor() {
        this.app = express();
        this.events = new EventEmitter();
    }

    start() {
        const port = process.argv[2] || 80;

        // Handle all GET and POST requests
        this.app.all('*', (req, res, next) => {
            const subdomain = req.headers.host.split('.')[0];
            switch (subdomain) {
                case 'play':
                    this.serve('./vanilla-media/play', req, res);
                    break;
                case 'media':
                    this.serve('./vanilla-media/media', req, res);
                    break;
                default:
                    res.status(404).send('404 Not Found');
                    break;
            }
        });

        this.app.listen(port, () => {
            console.log(`Server running on port ${port}`);
        });
    }

    async serve(prefix, req, res) {
        if (Object.keys(FORWARD_TO_DASH).some(path => req.url.includes(path))) {
            return this.forwardToDash(req, res);
        }

        let fileLoc = prefix + req.url.split("?")[0];
        const queryString = req.url.split("?")[1];

        if (fileLoc.includes("/sites/play.cphistory.pw/")) {
            fileLoc = fileLoc.replace("/sites/play.cphistory.pw/", "/sites/play.clubpenguin.com/");
        }

        const replace = this.shouldReplace(fileLoc, queryString, req);
        if (replace) {
            return this.serve(replace, req, res);
        }

        if (!fileLoc.split("/").pop().includes(".")) {
            fileLoc += "index.html";
        }

        if (!fs.existsSync(fileLoc)) {
            res.status(404).send('404 Not Found');
            return;
        }

        res.setHeader("Access-Control-Allow-Origin", "*");

        if (fileLoc.endsWith(".html") || fileLoc.endsWith(".xml") || fileLoc.endsWith(".css") || fileLoc.endsWith(".json")) {
            let cookie = req.headers.cookie;
            let dateCookie = (cookie && cookie.includes("gameAtDate=")) ? cookie.split(";").find(cookie => cookie.includes("gameAtDate=")).split("=")[1] : "default";
            let file = fs.readFileSync(fileLoc, "utf8");
            let host = req.headers.host.split(".");
            host.shift();
            const myDomain = host.join(".");
            const replacements = [
                { target: "http://", replacement: "https://" },
                { target: "media1.clubpenguin.com", replacement: `media.${myDomain}` },
                { target: "media2.clubpenguin.com", replacement: `media.${myDomain}` },
                { target: "play.clubpenguin.com", replacement: `play.${myDomain}` },
                { target: "www.clubpenguin.com", replacement: `play.${myDomain}` },
                { target: "secured.clubpenguin.com", replacement: `play.${myDomain}` },
                { target: "n7vcp1clubpwns.clubpenguin.com", replacement: `play.${myDomain}` },
                { target: "CP_GAME_DATE", replacement: dateCookie },
                { target: "127.0.0.1", replacement: PUBLIC_IP},
            ];

            replacements.forEach(({ target, replacement }) => {
                const regex = new RegExp(`(?<=^|[\\r\\n]).*?(${target}.*)`, 'g');
                file = file.replace(regex, match => {
                    if (match.includes("/sites/")) {
                        return match;
                    }
                    return match.replaceAll(target, replacement);
                });
            });

            res.setHeader("Content-Type", mime.lookup(fileLoc));
            res.send(file);
        } else {
            const fileStream = fs.createReadStream(fileLoc);
            fileStream.pipe(res);
        }
    }

    shouldReplace(fileLoc, queryString, req) {
        if (fileLoc.startsWith("./content")) return false;

        if (fileLoc == "./vanilla-media/play/") {
            return "./content";
        }

        if (!queryString || queryString == "") {
            return false;
        }

        const date = queryString.split("=")[1];

        if (fs.existsSync(`./content/${date}/${fileLoc.replace("./vanilla-media", "")}`)) {
            console.log(`Serving ./content/${date}/${fileLoc.replace("./vanilla-media", "")}`);
            return `./content/${date}/${fileLoc.includes("/media/") ? "media" : "play"}`;
        }
    }

     async forwardToDash(req, res) {
        const path = FORWARD_TO_DASH[Object.keys(FORWARD_TO_DASH).find(path => req.url.includes(path))];
        let url = `${DASH_URL}/${path}`;

        // Replace placeholders in URL
        ["en", "es", "pt", "fr"].forEach(lang => {
            if (req.url.includes(lang)) {
                url = url.replace("$lang", lang);
            }
        });
        url = url.replace("$lang", "en");

        if (req.url.includes("/avatar/")) {
            const user = req.url.split("/avatar/")[1].split("/")[0];
            url = url.replace("$user", user);
        }

        const queryString = req.url.split("?")[1];
        url = url.replace("$args", queryString);

        try {
            // Get the raw body of the request
            const rawBody = await raw(req, {
                encoding: 'utf8',
            });

            // Forward raw body to DASH server
            const dashResponse = await fetch(url, {
                method: req.method,
                headers: req.headers,
                body: (req.method === "POST") ? rawBody : null,
            });

            // Forward response headers
            dashResponse.headers.forEach((value, key) => {
                res.setHeader(key, value);
            });

            // Forward response status code
            res.status(dashResponse.status);

            // Forward response body
            const responseBody = await dashResponse.text();
            res.send(responseBody);
        } catch (error) {
            console.error(error);
            res.status(500).send('500 Internal Server Error');
        }
    }
}
