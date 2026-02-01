// scripts/create-migration.js
const fs = require('fs');
const path = require('path');

// Получаем имя миграции из аргументов
const migrationName = process.argv[2];

if (!migrationName) {
  console.error('Usage: npm run db:migrate:new -- <migration-name>');
  process.exit(1);
}

// Генерируем временную метку
const timestamp = new Date().toISOString().replace(/\D/g, '').substring(0, 14);
const fileName = `${timestamp}-${migrationName}.ts`;
const filePath = path.join(__dirname, '..', 'src', 'core', 'database', 'migrations', fileName);

// Шаблон миграции
const template = `import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface, Sequelize: typeof DataTypes): Promise<void> {
  // TODO: implement migration
}

export async function down(queryInterface: QueryInterface, Sequelize: typeof DataTypes): Promise<void> {
  // TODO: implement rollback
}
`;

// Создаём файл
fs.writeFileSync(filePath, template);
console.log(`✓ Migration created: ${filePath}`);
console.log(`\nDon't forget to implement up() and down() functions!`);