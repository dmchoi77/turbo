import { useState, useEffect, lazy, Suspense } from "react";
import Head from "next/head";
import type { GetServerSideProps } from "next";

// Lazy load the remote component only on client side
const RemoteAppLoader = () => {
  const [RemoteApp, setRemoteApp] = useState<React.ComponentType | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Dynamic import only runs on client
    import("remoteApp/App")
      .then((module) => {
        setRemoteApp(() => module.default);
      })
      .catch((err) => {
        console.error("Failed to load remote app:", err);
        setError("Failed to load remote component. Make sure remote-app is running on port 3200.");
      });
  }, []);

  if (error) {
    return (
      <div style={{ padding: "20px", border: "2px solid #f44336", borderRadius: "8px", color: "#f44336" }}>
        {error}
      </div>
    );
  }

  if (!RemoteApp) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        Loading Remote App...
      </div>
    );
  }

  return <RemoteApp />;
};

export default function Home() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <>
      <Head>
        <title>Next.js Host - Module Federation</title>
        <meta name="description" content="Next.js Host with Module Federation" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main style={{ padding: "40px", fontFamily: "system-ui, sans-serif" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <h1 style={{ fontSize: "2rem", marginBottom: "16px" }}>
            🏠 Next.js Host (Page Router)
          </h1>
          <p style={{ color: "#666", marginBottom: "32px" }}>
            This is the Next.js host application using webpack Module Federation
            to load a remote component from Vite.
          </p>

          <section style={{ marginTop: "32px" }}>
            <h2 style={{ fontSize: "1.5rem", marginBottom: "16px" }}>
              Remote Component from Vite:
            </h2>
            {isClient ? (
              <RemoteAppLoader />
            ) : (
              <div style={{ padding: "20px", textAlign: "center" }}>
                Loading...
              </div>
            )}
          </section>
        </div>
      </main>
    </>
  );
}

// Force SSR mode to prevent static generation
// This is required for Module Federation to work correctly
export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {},
  };
};
