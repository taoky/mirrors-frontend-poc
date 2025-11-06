import { h, Fragment, render } from "./mini-jsx.js";
import repoRaw from "./data/repo.json";
import revproxyRaw from "./data/revproxy.json";
import "./index.css";
import "./fonts.css";
import { Header } from "./components/header.index";
import { Sidebar } from "./components/sidebar.index";
import { Footer } from "./components/footer.index";
import { Modal } from "./components/modal.index";
import { formatDateTime } from "./utils";
import { setupSearchFilter } from "./components/script.index/search-filter";
import { setupModal } from "./components/script.index/modal-init";

interface ProxyRule {
  src: string;
  dst: string;
}
const revproxy = revproxyRaw as ProxyRule[];

interface RepoRule {
  mtime: number;
  repo: string;
  help: boolean;
}
const repo = repoRaw as RepoRule[];

function RevproxyTable() {
  return <table>
    <tbody>
      {revproxy.map(({ src, dst }) => (
        <tr>
          <td>{src}</td>
          <td>{dst}</td>
        </tr>
      ))}
    </tbody>
  </table>
}

function RepoTable() {
  return <table class="filelist">
    <thead>
      <tr id="firstline">
        <th id="name">Folder</th>
        <th class="update">Last Update</th>
        <th id="help">Help</th>
      </tr>
    </thead>
    <tbody>
      {repo.map(({ mtime, repo, help }) => (
        <tr>
          <td class="filename">
            <a href={`${repo}/`}>{repo}</a>
          </td>
          <td class="filetime">{formatDateTime(new Date(mtime * 1000))}</td>
          <td class="help">
            {help ? <a href={`help/${repo}.html`}>Help</a> : ""}
          </td>
        </tr>
      ))}
    </tbody>
  </table>;
}

function App() {
  return (
    <>
      <Header />
      <div id="wrapper">
        <div id="filelist">
          <div style="overflow:hidden">
            <input id="revproxy" type="checkbox" />
            <h3>
              <label for="revproxy">
                反向代理列表{" "}
                <span>+</span>
                <span>-</span>
              </label>
            </h3>
            <div style="overflow-x:auto">
              <RevproxyTable />
            </div>
          </div>

          <div>
            <h3 id="filetitle">文件列表</h3>
            <input
              placeholder="按 S 过滤"
              id="search"
              type="search"
              autocomplete="off"
            />
          </div>

          <RepoTable />
        </div>
        <Sidebar />
        <div style="clear: both;"></div>
      </div>
      <Footer />
      <Modal type="app" />
      <Modal type="iso" />
    </>
  );
}

const root = document.getElementById("root");
if (!root) throw new Error("#root not found");
render(<App />, root);

setupSearchFilter();
setupModal();
