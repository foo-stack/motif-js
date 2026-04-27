/** @type {import('next').NextConfig} */
const nextConfig = {
  // motif-js workspaces ship 'use client' marked code; transpile is fine.
  transpilePackages: ['@motif-js/react', '@motif-js/react-web', '@motif-js/tokens'],
  // Quiet the build for this demo workspace.
  reactStrictMode: true,
};

export default nextConfig;
