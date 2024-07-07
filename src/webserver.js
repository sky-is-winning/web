import express from 'express';
import {publicIpv4} from 'public-ip';
import fs from 'fs';
import { promises as fsPromises } from 'fs';
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

const PARTY_DATES = {
    'waddleon': '2017-01-31',
    'cpi': '2017-01-04',
    'hol2016': '2016-12-01',
    'mj2016': '2016-11-02',
    'anni11': '2016-10-09',
    'hween16': '2016-09-28',
    'frozen16': '2016-08-17',
    'dory': '2016-07-06',
    'zootopia': '2016-05-18',
    'wild16': '2016-04-20',
    'puffle16': '2016-03-16',
    'op16': '2016-02-10',
    "prehistoric16": "2016-01-20",
    'hol15': '2015-12-16',
    'op15': '2015-11-18',
    'paint15': '2015-11-10',
    'mustache': '2015-11-04',
    'hween15': '2015-10-21',
    'anni10': '2015-09-30',
    'pirate15': '2015-09-16',
    'decendants': '2015-09-16',
    'fashion15': '2015-08-26',
    'insideout': '2015-07-22',
    'snow15': '2015-06-30',
    'rainbow': '2015-05-21',
    'fair15': '2015-05-21',
    'frozen15': '2015-04-23',
    'cave15': '2015-04-15',
    'puffle15': '2015-03-26',
    'pi': '2015-03-11',
    'soundstudio': '2015-02-19',
    'starwars15': '2015-01-22',
    'walrus': '2014-01-01',
    'pirate14': '2014-01-01',
    'anni9': '2014-01-01',
    'hween14': '2014-01-01',
    'school': '2014-01-01',
    'frozen14': '2014-01-01',
    'turbo': '2014-01-01',
    'mj14': '2014-01-01',
    'cup': '2014-01-01',
    'prom': '2014-01-01',
    'future': '2014-01-01',
    'hatweek': '2014-01-01',
    'puffle14': '2014-01-01',
    'muppets': '2014-01-01',
    'russia': '2014-01-01',
    'fair14': '2014-01-01',
    'prehistoric14': '2014-01-01',
    'hol13': '2013-01-01',
    'oppuff': '2013-01-01',
    'anni8': '2013-01-01',
    'hween13': '2013-01-01',
    'medieval13': '2013-01-01',
    'tbsj': '2013-01-01',
    'starwars13': '2013-01-01',
    'monsters': '2013-01-01',
    'cj13': '2013-01-01',
    'marvel13': '2013-01-01',
    'op13': '2013-01-01',
    'puffle13': '2013-01-01',
    'rednose': '2013-01-01',
    'hollywood': '2013-01-01',
    'prehistoric13': '2013-01-01',
    'hol12': '2012-01-01',
    'op12': '2012-01-01',
    'anni7': '2012-01-01',
    'hween12': '2012-01-01',
    'fair12': '2012-01-01',
    'fruit': '2012-01-01',
    'mj12': '2012-01-01',
    'marvel12': '2012-01-01',
    'medieval12': '2012-01-01',
    'earthday12': '2012-01-01',
    'easter12': '2012-01-01',
    'fools12': '2012-01-01',
    'puffle12': '2012-01-01',
    'rhquest': '2012-01-01',
    'fashion12': '2012-01-01',
    'water': '2012-01-01',
    'hol11': '2011-01-01',
    'cj11': '2011-01-01',
    'anni6': '2011-01-01',
    'hween11': '2011-01-01',
    'fair11': '2011-01-01',
    'snow11': '2011-01-01',
    'island11': '2011-01-01',
    'mj11': '2011-01-01',
    'battle': '2011-01-01',
    'medieval11': '2011-01-01',
    'easter11': '2011-01-01',
    'earthday11': '2011-01-01',
    'fools11': '2011-01-01',
    'puffle11': '2011-01-01',
    'wild11': '2011-01-01',
    'hol10': '2010-01-01',
    'water10': '2010-01-01',
    'hween10': '2010-01-01',
    'anni5': '2010-01-01',
    'fair10': '2010-01-01',
    'mountain': '2010-01-01',
    'mj10': '2010-01-01',
    'island10': '2010-01-01',
    'medieval10': '2010-01-01',
    'earthday10': '2010-01-01',
    'fools10': '2010-01-01',
    'awards': '2010-01-01',
    'puffle10': '2010-01-01',
    'cave10': '2010-01-01',
    'hol09': '2009-01-01',
    'winter09': '2009-01-01',
    'fire': '2009-01-01',
    'hween09': '2009-01-01',
    'anni4': '2009-01-01',
    'fair09': '2009-01-01',
    'flight': '2009-01-01',
    'mj09': '2009-01-01',
    'adventure': '2009-01-01',
    'medieval09': '2009-01-01',
    'fools09': '2009-01-01',
    'awards09': '2009-01-01',
    'paddy09': '2009-01-01',
    'puffle09': '2009-01-01',
    'fiesta': '2009-01-01',
    'dance': '2009-01-01',
    'hol08': '2008-01-01',
    'dojoopen': '2008-01-01',
    'dojo': '2008-01-01',
    'hween08': '2008-01-01',
    'anni3': '2008-01-01',
    'fair08': '2008-01-01',
    'games': '2008-01-01',
    'mj08': '2008-01-01',
    'water08': '2008-01-01',
    'medieval08': '2008-01-01',
    'rharrival': '2008-01-01',
    'fools08': '2008-01-01',
    'paddy08': '2008-01-01',
    'sub': '2008-01-01',
    'migrator': '2008-01-01',
    'fiesta08': '2008-01-01',
    'hol07': '2007-01-01',
    'surprise': '2007-01-01',
    'hween07': '2007-01-01',
    'anni2': '2007-01-01',
    'fair07': '2007-01-01',
    'camp': '2007-01-01',
    'water07': '2007-01-01',
    'summer07': '2007-01-01',
    'cove': '2007-01-01',
    'pirate07': '2007-01-01',
    'fools07': '2007-01-01',
    'paddy07': '2007-01-01',
    'snow07': '2007-01-01',
    'fiesta07': '2007-01-01',
    'hol06': '2006-01-01',
    'lime': '2006-01-01',
    'hween06': '2006-01-01',
    'anni1': '2006-01-01',
    'lighthouse': '2006-01-01',
    'sports': '2006-01-01',
    'wildwest': '2006-01-01',
    'summer06': '2006-01-01',
    'cave': '2006-01-01',
    'fools06': '2006-01-01',
    'paddy06': '2006-01-01',
    'pizza': '2006-01-01',
    'valentines': '2006-01-01',
    'luau': '2006-01-01',
    'testing': '2005-01-01',
    'hol05': '2005-01-01',
    'puffle': '2005-01-01',
    'hween05': '2005-01-01',
    'beta': '2005-01-01'
};

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

        const replace = await this.shouldReplace(fileLoc, queryString, req, res);
        if (replace) {
            if (replace === true) return;
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
                { target: "media1.clubpenguin.com", replacement: `media.${myDomain}` },
                { target: "media2.clubpenguin.com", replacement: `media.${myDomain}` },
                { target: "play.clubpenguin.com", replacement: `play.${myDomain}` },
                { target: "www.clubpenguin.com", replacement: `play.${myDomain}` },
                { target: "secured.clubpenguin.com", replacement: `play.${myDomain}` },
                { target: "n7vcp1clubpwns.clubpenguin.com", replacement: `play.${myDomain}` },
                { target: "CP_GAME_DATE", replacement: dateCookie },
                
            ];

            if (process.argv[3] != "local") replacements.push({ target: "http://", replacement: "https://" }, { target: "127.0.0.1", replacement: PUBLIC_IP});

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

    async shouldReplace(fileLoc, queryString, req, res) {
        if (fileLoc.startsWith("./content")) return false;

        if (fileLoc == "./vanilla-media/play/") {
            return "./content";
        }

        if (!queryString || queryString == "") {
            return false;
        }

        const date = queryString.split("=")[1];
        const filePath = fileLoc.replace("./vanilla-media", "");

        if (fs.existsSync(`./content/${date}${filePath}`)) {
            return `./content/${date}/${fileLoc.includes("/media/") ? "media" : "play"}`;
        } else if (Object.keys(PARTY_DATES).includes(date)) {
            if (fs.existsSync(`./content/dated${filePath}.json`)) {
                let json = JSON.parse(fs.readFileSync(`./content/dated${filePath}.json`, "utf8"))
                let dateOfParty = new Date(PARTY_DATES[date]);
                let swfToGrab = Object.values(json)[0];
                for (let key in json) {
                    let dateOfKey = new Date(key);
                    if (dateOfKey <= dateOfParty) {
                        swfToGrab = json[key];
                    }
                }
                res.setHeader("Access-Control-Allow-Origin", "*");
                const fileLoc = `./content/dated/${filePath.split(".")[0]}/${swfToGrab}`
                const fileStream = fs.createReadStream(fileLoc);
                fileStream.pipe(res);
                console.log(`Serving ${fileLoc}`);
                return true;
            } else if (fs.existsSync(`./content/default${filePath}`)) {
                return `./content/default/${fileLoc.includes("/media/") ? "media" : "play"}`;
            }
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
