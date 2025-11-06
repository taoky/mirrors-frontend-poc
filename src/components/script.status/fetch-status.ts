interface SyncDataItem {
  name: string;
  upstream: string;
  syncing: boolean;
  size: number;
  exitCode: number;
  lastSuccess: number;
  updatedAt: number;
  prevRun: number;
  nextRun: number;
}

function fileSizeToReadable(bytes: number) {
  var exp = (Math.log(bytes) / Math.log(1024)) | 0;
  var result = (bytes / Math.pow(1024, exp)).toFixed(2);
  if (Number(result) >= 0)
    return result + " " + (exp == 0 ? "bytes" : "KMGTPEZY"[exp - 1] + "B");
  else return "Unknown";
}

function genError(code: number) {
  const errorInfos: Record<string, string> = {
    5: "Server reached max connections",
    10: "Error in socket I/O",
    11: "Error in socket I/O",
    12: "Error in rsync protocol data stream",
    23: "Partial transfer due to error",
    24: "Partial transfer due to vanished source files",
    25: "The --max-delete limit stopped deletions",
    30: "Timeout in data send/receive",
    137: "The syncing container was terminated by SIGKILL signal",
    143: "The syncing container was terminated by SIGTERM signal",
    "-2": "The syncing container timed out and was thus terminated",
  };
  if (code == 0) {
    return "✅";
  } else {
    var emoji = "❌";
    if (code == 25) {
      emoji = "🧹";
    }
    let codeStr = code.toString();
    var errorInfo = codeStr;
    if (codeStr in errorInfos)
        errorInfo += '<span class="comment">' + errorInfos[codeStr] + "</span>";
    return emoji + " (" + errorInfo + ")";
  }
}

function genSyncing(isSyncing: boolean) {
  if (isSyncing === true) {
    return "🔄";
  } else {
    return "⏸️ ";
  }
}

async function fetchSyncStatus() {
  // For demo purpose, to avoid CORS issue when running locally
  var res = await fetch("/data/status.json");
  if (!res.ok) {
    throw new Error("Load sync status failed");
  }
  var data: SyncDataItem[] = await res.json();
  return data;
}

function getSyncDataItemTableRow(item: SyncDataItem) {
  return (
    "<tr" +
    (item.exitCode != 0 && item.exitCode != 25 ? ' class="failedSync"' : "") +
    ">" +
    "<td>" +
    item.name +
    "</td>" +
    "<td>" +
    new Date(item.lastSuccess * 1000).toLocaleString() +
    "</td>" +
    '<td class="withComment">' +
    genError(item.exitCode) +
    "</td>" +
    "<td>" +
    new Date(item.updatedAt * 1000).toLocaleString() +
    "</td>" +
    "<td>" +
    item.upstream +
    "</td>" +
    `<td class="withComment" data-sort=${String(item.size).padStart(
      100,
      "0"
    )}>` +
    fileSizeToReadable(item.size) +
    '<span class="comment">' +
    item.size.toLocaleString() +
    " bytes</span>" +
    "</td>" +
    "<td>" +
    genSyncing(item.syncing) +
    "</td>" +
    "</tr>"
  );
}

export async function initStatusTable() {
  var tbodyMaybe = document
    .getElementById("status")
    ?.getElementsByTagName("tbody")[0];
  if (!tbodyMaybe) {
    console.error("Status table body not found");
    return;
  }
  var tbody = tbodyMaybe;
  try {
    var data = await fetchSyncStatus();
    data.map((item) => {
      tbody.innerHTML += getSyncDataItemTableRow(item);
    });
    new (window as any).Tablesort(document.getElementById("status")!);
    return;
  } catch (error) {
    console.error(error);
    tbody.innerHTML = "Load sync status failed";
    return;
  }
}
