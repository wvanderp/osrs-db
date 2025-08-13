import axios from "axios";
import fs from "fs";
import yauzl from "yauzl";

const url = "https://archive.openrs2.org/caches.json";

export interface OsrsCache {
  id: number;
  scope: string;
  game: string;
  environment: string;
  language: string;
  builds?:
    | ({
        major: number;
        minor?: number | null;
      } | null)[]
    | null;
  timestamp?: string | null;
  sources?: (string | null)[] | null;
  valid_indexes: number;
  indexes: number;
  valid_groups: number;
  groups: number;
  valid_keys: number;
  keys: number;
  size: number;
  blocks: number;
  disk_store_valid: boolean;
}

(async () => {
  console.log("Fetching cache URL...");
  const response = await axios.get<OsrsCache[]>(url);

  if (response.status !== 200) {
    throw new Error(`Failed to fetch URL: ${response.statusText}`);
  }

  const json = response.data;

  const newest = json
    .filter((cache) => cache.game === "oldschool")
    .filter((cache) => cache.environment === "live")
    .sort((a, b) => {
      // date descending
      return (
        new Date(b.timestamp!).getTime() - new Date(a.timestamp!).getTime()
      );
    })[0];

  // get the newest cache and unzip it and stream it to file
  console.log(`Downloading cache ${newest.id}...`);
  console.log(
    `Cache URL: https://archive.openrs2.org/caches/runescape/${newest.id}`
  );
  const cacheURL = `https://archive.openrs2.org/caches/runescape/${newest.id}/disk.zip`;

  const cache = await axios.get(cacheURL, {
    responseType: "arraybuffer",
  });

  fs.writeFileSync("cache.zip", cache.data);

  console.log("Unzipping cache...");

  if (fs.existsSync("cache")) {
    fs.rmSync("cache", { recursive: true });
  }

  fs.mkdirSync("cache");

  yauzl.open(
    "cache.zip",
    { lazyEntries: true },
    (err: Error | null, zipfile: yauzl.ZipFile | undefined) => {
      if (err) throw err;
      if (!zipfile) throw new Error("Failed to open zipfile");

      zipfile.readEntry();
      zipfile.on("entry", (entry: yauzl.Entry) => {
        if (/\/$/.test(entry.fileName)) {
          zipfile.readEntry();
        } else {
          zipfile.openReadStream(
            entry,
            (
              err: Error | null,
              readStream: NodeJS.ReadableStream | undefined
            ) => {
              if (err) throw err;
              if (!readStream) throw new Error("Failed to open readStream");
              readStream.on("end", () => {
                zipfile.readEntry();
              });
              readStream.pipe(fs.createWriteStream(entry.fileName));
            }
          );
        }
      });
    }
  );

  // Download the keys.json file
  const keysURL = `https://archive.openrs2.org/caches/runescape/${newest.id}/keys.json`;
  console.log(`Downloading keys.json from ${keysURL}...`);
  const keysResponse = await axios.get(keysURL, {
    responseType: "json",
  });

  if (keysResponse.status !== 200) {
    throw new Error(`Failed to fetch keys.json: ${keysResponse.statusText}`);
  }

  fs.writeFileSync("keys.json", JSON.stringify(keysResponse.data, null, 2));
})();
