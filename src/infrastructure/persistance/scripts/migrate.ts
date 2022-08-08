import 'dotenv/config';
import { exec } from 'child_process';
import { resolve } from 'path';
import PersistanceSettings from '../settings/PersistanceSettings';

const config = new PersistanceSettings().get();

const migrationProcess = exec(
  `npx sequelize-cli db:migrate --url mysql://${config.user}:${config.password}@${config.host}:${config.port}/${config.database}`,
  {
    cwd: resolve('./dist/src/infrastructure/persistance'),
  },
);

migrationProcess.stdout.on('data', function (data) {
  console.log(data);
});
migrationProcess.stderr.on('data', function (data) {
  console.error(data);
});
