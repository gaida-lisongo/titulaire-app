/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['png.pngtree.com', 'res.cloudinary.com'], // Ajouter le domaine pour les avatars
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'png.pngtree.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

module.exports = nextConfig;