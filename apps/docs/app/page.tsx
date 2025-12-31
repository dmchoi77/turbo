"use client";

import Image, { type ImageProps } from "next/image";
import { Button } from "@repo/ui/button";
import _ from "lodash";
// docs 앱은 moment 대신 date-fns 사용 (더 작은 번들)
import { format } from "date-fns";
import styles from "./page.module.css";

// Large data array to increase bundle size
const largeDataArray = Array.from({ length: 10000 }, (_, i) => ({
  id: i,
  name: `Item ${i}`,
  description: `This is a description for item ${i}`,
  timestamp: Date.now() + i,
  metadata: {
    category: `Category ${i % 10}`,
    tags: Array.from({ length: 5 }, (_, j) => `tag-${i}-${j}`),
    data: new Array(100).fill(0).map((_, k) => `data-${i}-${k}`),
  },
}));

// Utility functions using lodash to ensure it's included in bundle
const processData = () => {
  const grouped = _.groupBy(largeDataArray, (item) => item.metadata.category);
  const sorted = _.sortBy(largeDataArray, ["id"]);
  const chunked = _.chunk(largeDataArray, 100);
  const flattened = _.flattenDeep(chunked);
  const unique = _.uniqBy(largeDataArray, "id");
  const shuffled = _.shuffle(largeDataArray.slice(0, 1000));
  const debounced = _.debounce(() => {}, 100);
  const throttled = _.throttle(() => {}, 100);
  const memoized = _.memoize((n: number) => n * 2);

  // Use more lodash functions to increase bundle size
  const mapped = _.map(largeDataArray, (item) => ({
    ...item,
    processed: true,
  }));
  const filtered = _.filter(mapped, (item) => item.id % 2 === 0);
  const reduced = _.reduce(filtered, (acc, item) => acc + item.id, 0);

  return {
    grouped,
    sorted,
    chunked,
    flattened,
    unique,
    shuffled,
    debounced,
    throttled,
    memoized,
    mapped,
    filtered,
    reduced,
  };
};

type Props = Omit<ImageProps, "src"> & {
  srcLight: string;
  srcDark: string;
};

const ThemeImage = (props: Props) => {
  const { srcLight, srcDark, ...rest } = props;

  return (
    <>
      <Image {...rest} src={srcLight} className="imgLight" />
      <Image {...rest} src={srcDark} className="imgDark" />
    </>
  );
};

export default function Home() {
  // Process data to ensure lodash is included in bundle
  const processedData = processData();
  const currentTime = format(new Date(), "yyyy-MM-dd HH:mm:ss");

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <ThemeImage
          className={styles.logo}
          srcLight="turborepo-dark.svg"
          srcDark="turborepo-light.svg"
          alt="Turborepo logo"
          width={180}
          height={38}
          priority
        />
        <ol>
          <li>
            Get started by editing <code>apps/docs/app/page.tsx</code>
          </li>
          <li>Save and see your changes instantly.</li>
          <li>Current time: {currentTime}</li>
          <li>
            Processed {Object.keys(processedData.grouped).length} categories
          </li>
        </ol>

        <div className={styles.ctas}>
          <a
            className={styles.primary}
            href="https://vercel.com/new/clone?demo-description=Learn+to+implement+a+monorepo+with+a+two+Next.js+sites+that+has+installed+three+local+packages.&demo-image=%2F%2Fimages.ctfassets.net%2Fe5382hct74si%2F4K8ZISWAzJ8X1504ca0zmC%2F0b21a1c6246add355e55816278ef54bc%2FBasic.png&demo-title=Monorepo+with+Turborepo&demo-url=https%3A%2F%2Fexamples-basic-web.vercel.sh%2F&from=templates&project-name=Monorepo+with+Turborepo&repository-name=monorepo-turborepo&repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Fturborepo%2Ftree%2Fmain%2Fexamples%2Fbasic&root-directory=apps%2Fdocs&skippable-integrations=1&teamSlug=vercel&utm_source=create-turbo"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className={styles.logo}
              src="/vercel.svg"
              alt="Vercel logomark"
              width={20}
              height={20}
            />
            Deploy now
          </a>
          <a
            href="https://turbo.build/repo/docs?utm_source"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.secondary}
          >
            Read our docs
          </a>
        </div>
        <Button appName="docs" className={styles.secondary}>
          Open alert
        </Button>
      </main>
      <footer className={styles.footer}>
        <a
          href="https://vercel.com/templates?search=turborepo&utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          href="https://turbo.build?utm_source=create-turbo"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to turbo.build →
        </a>
      </footer>
    </div>
  );
}
