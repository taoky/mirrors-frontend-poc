import "./status.css";
import "./tablesort.css";
import { h, Fragment, render } from "./mini-jsx.js";
import { initStatusTable } from "./components/script.status/fetch-status";

// CommonJS imports
import Tablesort from "./components/script.status/tablesort.js";
import _ from "./components/script.status/tablesort.filesize.js";

function Nav() {
  return (
    <div id="nav">
      <a href="#sync">👉 Sync Status</a>
      <a href="#server">👉 Server Status</a>
      <a href="https://mirrors.ustc.edu.cn/">👉 Mirrors Index</a>
    </div>
  );
}

function Sync() {
  return (
    <div id="sync">
      <h2>Sync Status</h2>
      <table id="status">
        <thead>
          <tr>
            <th>Archive name</th>
            <th>Last success</th>
            <th>Last status</th>
            <th>Update date</th>
            <th>Upstream</th>
            <th>Size</th>
            <th>Syncing</th>
          </tr>
        </thead>
        <tbody></tbody>
      </table>
    </div>
  );
}

function Grafana() {
  const panelIds = [1, 4, 16, 3, 36, 55, 7, 8];
  return (
    <div id="server">
      <h2>Server Status</h2>
      {panelIds.map((id, index) => (
        <>
          <iframe
            src={`https://monitor.ustclug.org/d-solo/000000001/mirrors?theme=light&panelId=${id}`}
            width="49%"
            height="300"
            frameborder="0"
            loading="lazy"
          ></iframe>
          {index % 2 === 1 && <br />}
        </>
      ))}
    </div>
  );
}

function App() {
  return (
    <>
      <Nav />
      <Sync />
      <Grafana />
    </>
  );
}

const root = document.getElementById("root");
if (!root) throw new Error("#root not found");
render(<App />, root);

(window as any).Tablesort = Tablesort;
initStatusTable();
