import { DASH_URL } from "./config.js";
import raw from 'raw-body';

export const FORWARD_TO_DASH = {
    "^/(penguin/create|[a-zA-Z]{2}/penguin/create)/?$": "create/vanilla/$lang",
    "^/(penguin/activate|[a-zA-Z]{2}/penguin/activate)/?$": "activate/vanilla/$lang",
    "^/(penguin/forgot-password|[a-zA-Z]{2}/penguin/forgot-password)/?$": "password/$lang",
    "^/avatar/\\d+/cp(\\?.*)?$": "avatar/$user?$args",
    "/web-service/snfgenerator/session": "session",
    "/api/v0.2/xxx/game/get/world-name-service/start_world_request": "swrequest?$args",
    "/manager/*": "manager",
    "/social/autocomplete/v2/search/suggestions": "autocomplete?$args"
};

export const forwardToDash = async function(req, res, PUBLIC_IP) {
    const path = FORWARD_TO_DASH[Object.keys(FORWARD_TO_DASH).find(path => new RegExp(path).test(req.url))];
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
    
    if (req.url.includes("/manager/")) {
        url = `${DASH_URL}${req.url}`
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
        let responseBody = await dashResponse.text();
        responseBody = responseBody.replace("localhost", PUBLIC_IP);
        res.send(responseBody);
    } catch (error) {
        console.error(error);
        res.status(500).send('500 Internal Server Error');
    }
}
