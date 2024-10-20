import fs from 'fs';

const url = 'https://archive.openrs2.org/caches.json';

export interface OsrsCache {
    id: number;
    scope: string;
    game: string;
    environment: string;
    language: string;
    builds?: ({
        major: number;
        minor?: number | null;
    } | null)[] | null;
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

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Failed to fetch URL: ${response.statusText}`);
    }

    const json = await response.json() as OsrsCache[];

    const newest = json
        .filter((cache) => cache.game === 'oldschool');

    fs.writeFileSync('newestCacheURL.json', JSON.stringify(newest, null, 2));
})();
