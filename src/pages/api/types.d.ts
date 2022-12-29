declare module "satori/wasm" {
  import Yoga from "yoga-layout";
  import type { ReactNode } from "react";
  import type { SatoriOptions } from "satori";
  export function init(yoga: typeof Yoga): void;
  export default function satori(
    element: ReactNode,
    options: SatoriOptions
  ): Promise<string>;
}

declare module "yoga-wasm-web" {
  import Yoga from "yoga-layout";
  export type YogaStatic = typeof Yoga
  export default function(wasm: ArrayBuffer): Promise<YogaStatic>;
  export function initStreaming(response: Response): Promise<YogaStatic>;
}