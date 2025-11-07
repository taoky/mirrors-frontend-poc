import { App } from "./index";
import { h, renderToString } from "./mini-framework/mini-ssr";
import fs from "node:fs";

const app = renderToString(<App />);
const html = `<!DOCTYPE html>
<html lang="zh-Hans-CN">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
    <title>USTC Open Source Software Mirror</title>
    <link rel="stylesheet" href="/static/index-ssr.css">
    <link rel="shortcut icon" type="image/png" href="/static/img/favicon.png">
</head>
<body>
    <div id="root">${app}</div>
    <script type="module">
        import { initIndexClientSide } from '/static/index-client.js';
        window.addEventListener('DOMContentLoaded', () => {
            initIndexClientSide();
        });
    </script>
</body>
</html>`;

// Write to dist/index.html
fs.mkdirSync("dist", { recursive: true });
fs.writeFileSync("dist/index.html", html);
