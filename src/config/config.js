import os from 'os';

function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (
        iface.family === 'IPv4' &&
        !iface.internal &&
        (iface.address.startsWith('192.168') ||
         iface.address.startsWith('10.') ||
         iface.address.startsWith('172.'))
      ) {
        return iface.address;
      }
    }
  }
  return '127.0.0.1'; // fallback
}

export const ip = getLocalIP();
export const BASE_URL = `http://${ip}:5000`;
export const MONGO_URI = "mongodb://localhost:27017/artColab";
export const JWT_SECRET="e5de02c4af1301dc5f29cf9b9525f83e75d11bb4a99630da9a0ec2a1ee588375ae02f8158af0b9acf5981b0b930d5a8a8cf8d53ae65dca56bfffe2eb5bf31374"
export const publicaciones_URL = `${BASE_URL}/publicaciones/`
export const uploads_URL = `${BASE_URL}/uploads/`
export const PORT=5000



export default { MONGO_URI, PORT, JWT_SECRET, publicaciones_URL,uploads_URL }