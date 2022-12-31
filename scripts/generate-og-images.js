import { promises } from "fs";
import { performance } from "perf_hooks";
import { Resvg } from "@resvg/resvg-js";
import { html } from "satori-html";
import satori from "satori";
import sanitizeHtml from "sanitize-html";
// fetch-polyfill.js
import fetch, {
  Blob,
  blobFrom,
  blobFromSync,
  File,
  fileFrom,
  fileFromSync,
  FormData,
  Headers,
  Request,
  Response,
} from "node-fetch";

if (!globalThis.fetch) {
  globalThis.fetch = fetch;
  globalThis.Headers = Headers;
  globalThis.Request = Request;
  globalThis.Response = Response;
  globalThis.FormData = FormData;
  globalThis.Blob = Blob;
  globalThis.File = File;
  globalThis.blobFrom = blobFrom;
  globalThis.blobFromSync = blobFromSync;
  globalThis.fileFrom = fileFrom;
  globalThis.fileFromSync = fileFromSync;
}

const height = 630;
const width = 1200;

function sanitize(text) {
  return sanitizeHtml(text, {
    textFilter: (text) => text.replace(/&amp;/g, "&"),
  });
}

function getPostData() {
  return fetch("http://joshuaryanbutler.com/wp-json/wp/v2/posts?per_page=100")
    .then((res) => res.json())
    .then((posts) => {
      return posts.map((post) => {
        return {
          title: sanitize(post.title.rendered),
          slug: post.slug,
          date: post.date,
          modified: post.modified,
        };
      });
    });
}

async function generateOgImage({ title, slug, date, image }) {
  const svg = await satori(
    html` <style>
        div {
          display: flex;
        }

        .wrapper {
          display: flex;
          background-color: white;
        }

        .inner {
          display: flex;
          flex-direction: column;
          flex-basis: 50%;
          padding: 64px;
          color: black;
          font-size: 24px;
          font-family: "Rubik";
        }

        .logo {
          font-size: 22px;
          font-family: "Rubik";
        }

        .date {
          margin-top: 180px;
          font-size: 16px;
          font-family: "Rubik";
        }

        .title {
          margin-top: 16px;
          font-size: 32px;
          font-family: "Rubik";
        }

        img {
          display: flex;
          flex-basis: 50%;
          object-fit: cover;
        }
      </style>
      <div class="wrapper">
        <div class="inner">
          <div class="logo">Josuah Ryan Butler</div>
          <div class="date">${new Date(date).toLocaleDateString("en-US")}</div>
          <div class="title">${title}</div>
        </div>
        <img
          width="${630}px"
          height="${623}px"
          src="data:image/jpg;base64, ${image}"
        />
      </div>`,
    {
      fonts: [
        {
          name: "Rubik",
          data: await promises.readFile(
            new URL("./fonts/Rubik-Bold.ttf", import.meta.url)
          ),
          weight: "400",
          style: "normal",
        },
      ],
      width,
      height,
    }
  );

  const resvg = new Resvg(svg, {
    fitTo: {
      mode: "original",
    },
  });
  const pngData = resvg.render();
  const pngBuffer = pngData.asPng();
  await promises.writeFile(
    new URL(`../public/meta/${slug}.png`, import.meta.url),
    pngBuffer
  );
}

async function main() {
  const t = performance.now();
  const posts = await getPostData();
  const image = await promises.readFile(
    new URL("./images/josh-og.jpg", import.meta.url),
    { encoding: "base64", width: 630, height: 623 }
  );
  await Promise.all(posts.map((post) => generateOgImage({ ...post, image })));
  console.info("✨ Done in", performance.now() - t, "ms");
}

main();
