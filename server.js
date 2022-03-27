const port = 80;
const http = require('http');
const fs = require('fs').promises;


const server = http.createServer(function (req, res) {

    let file = req.url.split('/').pop().split('?').shift();
    let ext = file.split('.').pop().toLowerCase();

    switch (ext) {
        case '':
            sendFile(res, `index.html`);
            break;
        case 'css':
        case 'docx':
        case 'ico':
            sendFile(res, file);
            break;
        case 'png':
            sendFile(res, `images/${file}`);
            break;
        default:
            send404(res);
    }
});

function getMime(file) {
    const mimes = {
        html: "text/html",
        css: "text/css",
        png: "image/png",
        ico: "image/x-icon",
        docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    };
    let ext = file.split('.').pop().toLowerCase();
    return mimes[ext];
}

function send404(response) {
    response.setHeader("Content-Type", "text/html");
    response.writeHead(404);
    response.end("404 Not Found");
}

function sendFile(response, fileName) {
    let contentType = getMime(fileName);
    if (!contentType) {
        return send404(response);
    }

    fs.readFile(fileName).then(contents => {
        response.setHeader("Content-Type", contentType);
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.writeHead(200);
        response.end(contents);
    }).catch(err => {
        send404(response);
    });
}

server.listen(port);

console.log(`Server started on port ${port}...`);
