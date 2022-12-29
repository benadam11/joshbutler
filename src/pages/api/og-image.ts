import satori, { init } from "satori/wasm";
import initYoga from "yoga-wasm-web";
import { initWasm, Resvg } from "@resvg/resvg-wasm";
import type { APIRoute } from "astro";
import { html } from "satori-html";

const markup = (
  title: string = "Hi, I’m Josh. Welcome to my website.",
  date?: string
) => html`
  <style>
    div {
      display: flex;
    }

    .wrapper {
      display: flex;
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
      <div class="date">${date}</div>
      <div class="title">${title}</div>
    </div>
    <img src="https://joshbutler.pages.dev/images/josh-og.jpg" />
  </div>
`;

const height = 630;
const width = 1200;

async function setup() {
  const [yogaInit] = await Promise.all([
    initYoga(
      await fetch("https://unpkg.com/yoga-wasm-web/dist/yoga.wasm").then(
        (res) => res.arrayBuffer()
      )
    ),
    initWasm(fetch("https://unpkg.com/@resvg/resvg-wasm/index_bg.wasm")),
  ]);

  init(yogaInit);
}

setup();

export const get: APIRoute = async () => {
  const svg = await satori(markup() as any, {
    fonts: [
      {
        name: "Roboto",
        data: await fetch(
          "https://github.com/googlefonts/rubik/raw/main/fonts/ttf/Rubik-Bold.ttf"
        ).then((res) => res.arrayBuffer()),
      },
      {
        name: "Crimson Text",
        data: await fetch(
          "https://github.com/googlefonts/Crimson/blob/master/fonts/ttf/CrimsonText-Regular.ttf"
        ).then((res) => res.arrayBuffer()),
      },
    ],
    height,
    width,
  });

  const resvg = new Resvg(svg, {
    fitTo: {
      mode: "original",
    },
  });

  const image = resvg.render();

  return new Response(image.asPng(), {
    headers: {
      "content-type": "image/png",
    },
  });
};
