import { h } from "../mini-framework/mini-core";
import isoinfoRaw from "../data/isoinfo.json";

export interface IsoItem {
  distro: string;
  category: string;
  urls: {
    name: string;
    url: string;
  }[];
}
const info = isoinfoRaw as IsoItem[];

export var isoinfo: IsoItem[] = [];
export var appinfo: IsoItem[] = [];

for (var i = 0; i < info.length; i++) {
  if (info[i].category === "os") {
    isoinfo.push(info[i]);
  } else if (info[i].category === "app") {
    appinfo.push(info[i]);
  } else {
    console.warn("Unknown category: " + info[i].category);
  }
}

export function modal(type: "app" | "iso") {
  if (type === "app") {
    var bx = document.getElementById("appmodal");
  } else {
    var bx = document.getElementById("isomodal");
  }
  if (!bx) return;
  bx.style.visibility = bx.style.visibility == "visible" ? "hidden" : "visible";
}

export function switchdistro(type: "app" | "iso") {
  if (type === "app") {
    var distro = document.getElementById("appdistro");
    var s = document.getElementById("appversion");
    var info = appinfo;
  } else {
    var distro = document.getElementById("isodistro");
    var s = document.getElementById("isoversion");
    var info = isoinfo;
  }
  if (!distro || !s) return;
  if (!(distro instanceof HTMLSelectElement)) return;
  if (!(s instanceof HTMLSelectElement)) return;
  var idx = distro.selectedIndex;
  s.options.length = 0;
  if (info.length === 0) {
    return;
  }
  for (var i = 0; i < info[idx].urls.length; i++) {
    s.options[s.options.length] = new Option(
      info[idx].urls[i].name,
      i.toString()
    );
  }
  switchversion(type);
}

function switchversion(type: "app" | "iso") {
  // show warning about exotic architectures
  if (type === "app") {
    var s = document.getElementById("appversion");
    var warning_element = document.getElementById("appdownload_warning");
  } else {
    var s = document.getElementById("isoversion");
    var warning_element = document.getElementById("isodownload_warning");
  }
  if (!s || !warning_element) return;
  if (!(s instanceof HTMLSelectElement)) return;
  var text = s.options[s.selectedIndex].text;
  var exotic_archs = ["aarch64", "ppc64le", "arm64"];
  var exotic_exclude = ["android"];
  for (var i = 0; i < exotic_archs.length; i++) {
    if (text.indexOf(exotic_archs[i]) !== -1) {
      if (text.toLowerCase().indexOf(exotic_exclude[i]) !== -1) {
        continue;
      }
      warning_element.style.display = "block";
      warning_element.textContent =
        "提示：如果你不知道 " +
        exotic_archs[i] +
        " 是什么，你所选择的镜像或文件可能将无法在你的设备上正常运行，请考虑选择其他文件。";
      return;
    }
  }
  warning_element.style.display = "none";
}

function downloadiso(type: "app" | "iso") {
  if (type === "app") {
    var distro = document.getElementById("appdistro");
    var version = document.getElementById("appversion");
  } else {
    var distro = document.getElementById("isodistro");
    var version = document.getElementById("isoversion");
  }
  if (!distro || !version) return;
  if (!(distro instanceof HTMLSelectElement)) return;
  if (!(version instanceof HTMLSelectElement)) return;
  var i = distro.selectedIndex;
  var j = version.selectedIndex;
  if (type === "app") {
    var link = appinfo[i].urls[j].url;
  } else {
    var link = isoinfo[i].urls[j].url;
  }
  window.open(link);
  modal(type);
}

export function Modal({ type }: { type: "app" | "iso" }) {
  return (
    <div class="modal" id={`${type}modal`}>
      <div
        class="modalclear"
        id={`${type}modalclear`}
        onclick={() => modal(type)}
      ></div>
      <div class="modalcontainer" id={`${type}modalcontainer`} onclick="">
        <div class="modaltitle" id={`${type}modaltitle`}>
          <span>{type == "app" ? "获取开源软件" : "获取安装镜像"}</span>
          <span onclick={() => modal(type)} style="float:right;cursor:pointer">
            X
          </span>
        </div>
        <div class="modalcontent" id={`${type}modalcontent`}>
          <p>
            {type == "app" ? "选择开源软件：" : "选择安装发行版："}
            <select
              id={`${type}distro`}
              onchange={() => switchdistro(type)}
            ></select>
          </p>
          <p>
            {type == "app" ? "选择软件版本：" : "选择发行版版本："}
            <select id={`${type}version`} onchange={() => switchversion(type)}>
              <option value="none">-</option>
            </select>
          </p>
          <p
            style="display: none"
            id={`${type}download_warning`}
            class="download_warning"
          ></p>
          <span class="btn" onclick={() => downloadiso(type)}>
            {type == "app" ? "获取文件 >" : "获取 ISO >"}
          </span>
        </div>
      </div>
    </div>
  );
}
