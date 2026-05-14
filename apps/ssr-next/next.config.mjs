/** @type {import('next').NextConfig} */
const nextConfig = {
  // motif-js workspaces ship 'use client' marked code; transpile is fine.
  transpilePackages: ['@usemotif/react', '@usemotif/tokens'],
  // Quiet the build for this demo workspace.
  reactStrictMode: true,
};

export default nextConfig;
