import app from './app';
import { env } from './config/env';
import fs from 'fs';

// Ensure uploads directory exists
const uploadDir = env.UPLOAD_DIR;
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

app.listen(env.PORT, '0.0.0.0', () => {
  console.log(`\n🌾 GrowSmart Backend running on http://localhost:${env.PORT}`);
  console.log(`   Environment: ${env.NODE_ENV}`);
  console.log(`   Frontend:    ${env.FRONTEND_URL}`);
  console.log(`   API:         http://localhost:${env.PORT}/api`);
  console.log(`   Health:      http://localhost:${env.PORT}/api/health\n`);
});
