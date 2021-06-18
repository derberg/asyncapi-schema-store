/**
 * Run this command after cloning the repo locally:
 *
 *    deno run --allow-net --allow-read index.ts
 *
 */

import { opine } from "https://deno.land/x/opine@1.4.0/mod.ts";
import { dirname, join } from "https://deno.land/std@0.97.0/path/mod.ts";
import { getIPLocation } from "https://deno.land/x/ip_location@v1.0.0/mod.ts";

const app = opine();
const __dirname = dirname(import.meta.url);

app.get("/", function (_req, res) {
  res.send(
    "<ul>" +
      '<li>Download <a href="/files/2.0.0.json">AsyncAPI 2.0.0 JSON Schema</a>.</li>' +
      "</ul>",
  );
});

app.get("/files/:file(*)", async function (req, res, next) {
  const filePath = join(__dirname, req.params.file);
  console.log("Object", req.headers);
  console.log("IP", await getIPLocation(req.ip));
  try {
    await res.download(filePath);
    console.log("Spec got downloaded by another user :rocket:");
  } catch (err) {
    // file for download not found
    if (err instanceof Deno.errors.NotFound) {
      res.status = 404;
      res.send("Cant find that file, sorry!");

      return;
    }

    return next(err);
  }
});

if (import.meta.main) {
  app.listen({ port: 3000 });
  console.log("Opine started on port 3000");
}

export { app };
