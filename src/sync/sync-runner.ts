import { syncFixtures } from "./sync-fixtures";
import { syncLeagues } from "./sync-leagues";
import { syncLive } from "./sync-live";
import { syncResults } from "./sync-results";

export async function syncAll() {
  const results = [];
  results.push(await syncLeagues());
  results.push(await syncFixtures());
  results.push(await syncLive());
  results.push(await syncResults());
  return results;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  syncAll().then((results) => {
    const failed = results.some((entry) => entry.status === "failed");
    if (failed) process.exitCode = 1;
    console.log(JSON.stringify(results, null, 2));
  });
}
