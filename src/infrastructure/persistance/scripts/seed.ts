import 'dotenv/config';
import { exec } from 'child_process';
import { resolve } from 'path';
import PersistanceSettings from '../settings/PersistanceSettings';

const config = new PersistanceSettings().get();

const seedProcess = exec(
  `npx sequelize-cli db:seed:all --url mysql://${config.user}:${config.password}@${config.host}:${config.port}/${config.database}`,
  {
    cwd: resolve('./dist/src/infrastructure/persistance'),
  },
);

seedProcess.stdout.on('data', function (data) {
  console.log(data);
});
seedProcess.stderr.on('data', function (data) {
  console.error(data);
});
