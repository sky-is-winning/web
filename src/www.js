import fs from 'fs';
import mime from 'mime-types';

export default class WWW {
    async serve(req, res) {
        let fileLoc = "www/" + req.url.split("?")[0];

        if (!fileLoc.split("/").pop().includes(".")) {
            if (!fileLoc.endsWith("/")) {
                fileLoc += "/";
            }
            fileLoc += "index.html";
        }

        if (!fs.existsSync(fileLoc)) {
            res.status(404).send('404 Not Found');
            return;
        }

        const queryString = req.url.split("?")[1];
        
        if (fileLoc.endsWith(".html")) {
            const header = fs.readFileSync("www/header.html", "utf8");
            const footer = fs.readFileSync("www/footer.html", "utf8");
            let content = fs.readFileSync(fileLoc, "utf8");
            content = header + content + footer;
            res.setHeader('Content-Type', 'text/html');
            res.send(content);
        } else {
            res.setHeader('Content-Type', mime.lookup(fileLoc));
            const fileStream = fs.createReadStream(fileLoc);
            fileStream.pipe(res);
        }
    }
}