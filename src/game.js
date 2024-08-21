import fs from 'fs';
import mime from 'mime-types';
import { FORWARD_TO_DASH, forwardToDash } from './dash.js';

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
    'walrus': '2014-12-18',
    'pirate14': '2014-11-20',
    'anni9': '2014-10-23',
    'hween14': '2014-10-23',
    'school': '2014-09-18',
    'frozen14': '2014-08-21',
    'turbo': '2014-07-31',
    'mj14': '2014-07-17',
    'cup': '2014-06-19',
    'prom': '2014-06-12',
    'future': '2014-05-22',
    'hatweek': '2014-05-01',
    'puffle14': '2014-04-17',
    'muppets': '2014-03-20',
    'russia': '2014-03-06',
    'fair14': '2014-02-20',
    'prehistoric14': '2014-01-23',
    'hol13': '2013-12-19',
    'oppuff': '2013-11-21',
    'anni8': '2013-10-24',
    'hween13': '2013-10-17',
    'medieval13': '2013-09-19',
    'tbsj': '2013-08-22',
    'starwars13': '2013-07-25',
    'monsters': '2013-06-27',
    'cj13': '2013-05-23',
    'marvel13': '2013-04-25',
    'op13': '2013-04-05',
    'puffle13': '2013-03-21',
    'rednose': '2013-02-28',
    'hollywood': '2013-02-14',
    'prehistoric13': '2013-01-07',
    'hol12': '2012-12-20',
    'op12': '2012-11-15',
    'anni7': '2012-10-23',
    'hween12': '2012-10-17',
    'fair12': '2012-09-20',
    'fruit': '2012-08-23',
    'mj12': '2012-07-19',
    'marvel12': '2012-06-14',
    'medieval12': '2012-05-17',
    'earthday12': '2012-04-19',
    'easter12': '2012-04-05',
    'fools12': '2012-03-29',
    'puffle12': '2012-03-15',
    'rhquest': '2012-02-24',
    'fashion12': '2012-02-02',
    'water': '2012-01-26',
    'hol11': '2011-12-15',
    'cj11': '2011-11-24',
    'anni6': '2011-10-23',
    'hween11': '2011-10-20',
    'fair11': '2011-09-22',
    'snow11': '2011-08-25',
    'island11': '2011-07-21',
    'mj11': '2011-06-16',
    'battle': '2011-05-31',
    'medieval11': '2011-05-20',
    'easter11': '2011-04-20',
    'earthday11': '2011-04-21',
    'fools11': '2011-03-25',
    'puffle11': '2011-02-18',
    'wild11': '2011-01-18',
    'hol10': '2010-12-16',
    'water10': '2010-11-16',
    'hween10': '2010-10-28',
    'anni5': '2010-10-23',
    'fair10': '2010-09-03',
    'mountain': '2010-08-12',
    'mj10': '2010-07-08',
    'island10': '2010-06-18',
    'popcorn': '2010-05-18',
    'medieval10': '2010-05-07',
    'earthday10': '2010-04-21',
    'fools10': '2010-03-31',
    'awards': '2010-03-18',
    'puffle10': '2010-02-18',
    'cave10': '2010-01-21',
    'hol09': '2009-12-18',
    'winter09': '2009-11-27',
    'fire': '2009-11-23',
    'hween09': '2009-10-27',
    'anni4': '2009-10-24',
    'fair09': '2009-09-04',
    'flight': '2009-08-14',
    'mj09': '2009-07-17',
    'adventure': '2009-06-12',
    'medieval09': '2009-05-08',
    'fools09': '2009-04-01',
    'awards09': '2009-03-20',
    'paddy09': '2009-03-13',
    'puffle09': '2009-02-20',
    'fiesta': '2009-01-22',
    'dance': '2009-01-15',
    'hol08': '2008-12-19',
    'dojoopen': '2008-11-14',
    'dojo': '2008-11-03',
    'hween08': '2008-10-29',
    'anni3': '2008-10-24',
    'fair08': '2008-09-26',
    'games': '2008-08-22',
    'mj08': '2008-07-25',
    'water08': '2008-06-13',
    'medieval08': '2008-05-16',
    'rharrival': '2008-04-25',
    'fools08': '2008-03-28',
    'paddy08': '2008-03-14',
    'sub': '2008-02-15',
    'migrator': '2008-02-05',
    'fiesta08': '2008-01-18',
    'hol07': '2007-12-21',
    'surprise': '2007-11-23',
    'hween07': '2007-10-26',
    'anni2': '2007-10-24',
    'fair07': '2007-09-21',
    'camp': '2007-08-24',
    'water07': '2007-07-13',
    'summer07': '2007-06-08',
    'cove': '2007-05-25',
    'pirate07': '2007-04-27',
    'fools07': '2007-03-30',
    'paddy07': '2007-03-16',
    'snow07': '2007-02-09',
    'fiesta07': '2007-01-19',
    'hol06': '2006-12-22',
    'lime': '2006-11-24',
    'hween06': '2006-10-27',
    'anni1': '2006-10-24',
    'lighthouse': '2006-09-21',
    'sports': '2006-08-11',
    'wildwest': '2006-07-14',
    'summer06': '2006-06-16',
    'cave': '2006-05-26',
    'fools06': '2006-03-31',
    'paddy06': '2006-03-17',
    'pizza': '2006-02-24',
    'valentines': '2006-02-14',
    'luau': '2006-01-27',
    'testing': '2005-12-05',
    'hol05': '2005-12-22',
    'puffle': '2005-11-15',
    'hween05': '2005-10-27',
    'beta': '2005-09-21'
};

export default class Game {
    constructor(PUBLIC_IP) {
        this.publicIp = PUBLIC_IP;
    }

    async serve(prefix, req, res) {
        if (Object.keys(FORWARD_TO_DASH).some(path => new RegExp(path).test(req.url))) {
            return forwardToDash(req, res, this.PUBLIC_IP);
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
                { target: "n7vcp1clubpwns.clubpenguin.com", replacement: `play.${myDomain}/` },
                { target: "CP_GAME_DATE", replacement: dateCookie },
                
            ];

            if (process.argv[3] != "local") replacements.push({ target: "http://", replacement: "https://" }, { target: "127.0.0.1", replacement: this.publicIp });

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
        fileLoc = fileLoc.replaceAll("//", "/");

        if (fileLoc.startsWith("./content")) return false;

        if (fileLoc == "./vanilla-media/play/") {
            return "./content";
        }

        const filePath = fileLoc.replace("./vanilla-media", "");

        if (queryString && queryString != "") {
            const date = queryString.split("=")[1];
        
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
                    return true;
                }
            }
        }

        if (fs.existsSync(`./content/default${filePath}`)) {
            return `./content/default/${fileLoc.includes("/media/") ? "media" : "play"}`;
        }
		
		return false
    }
}
