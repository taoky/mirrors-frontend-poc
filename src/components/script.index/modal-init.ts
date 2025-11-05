import { appinfo, isoinfo, IsoItem, switchdistro } from "../modal.index";

function update_distro_options(
  element_name: string,
  infovar: IsoItem[],
  type: "app" | "iso"
) {
  var s = document.getElementById(element_name);
  if (!s) return;
  if (!(s instanceof HTMLSelectElement)) return;
  s.options.length = 0;
  for (var i = 0; i < infovar.length; i++) {
    s.options[s.options.length] = new Option(infovar[i].distro, i.toString());
  }
  switchdistro(type);
}

export function setupModal() {
  update_distro_options("isodistro", isoinfo, "iso");
  update_distro_options("appdistro", appinfo, "app");
}
