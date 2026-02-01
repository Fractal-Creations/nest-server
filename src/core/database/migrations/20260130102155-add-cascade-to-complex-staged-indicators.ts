// src/core/database/migrations/XXXX-add-cascade-to-complex-staged-indicators.ts
import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface, Sequelize: typeof DataTypes): Promise<void> {
  // Удаляем существующие внешние ключи (оборачиваем в try-catch для безопасности)
  try {
    await queryInterface.removeConstraint('"complex-staged_indicators"', 'complex-staged_indicators_complexId_fkey');
    console.log('✓ Removed complexId constraint');
  } catch (e) {
    console.log('ℹ️ Constraint complex-staged_indicators_complexId_fkey not found (skipping removal)');
  }

  try {
    await queryInterface.removeConstraint('"complex-staged_indicators"', 'complex-staged_indicators_indicatorId_fkey');
    console.log('✓ Removed indicatorId constraint');
  } catch (e) {
    console.log('ℹ️ Constraint complex-staged_indicators_indicatorId_fkey not found (skipping removal)');
  }

  // Добавляем внешние ключи с ON DELETE CASCADE
  await queryInterface.addConstraint('"complex-staged_indicators"', {
    fields: ['complexId'],
    type: 'foreign key',
    name: 'complex-staged_indicators_complexId_fkey',
    references: {
      table: 'complexes',
      field: 'id'
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  });
  console.log('✓ Added CASCADE constraint for complexId');

  await queryInterface.addConstraint('"complex-staged_indicators"', {
    fields: ['indicatorId'], // ⚠️ Важно: именно indicatorId, а не indicatorId
    type: 'foreign key',
    name: 'complex-staged_indicators_indicatorId_fkey',
    references: {
      table: 'staged-indicators',
      field: 'id'
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  });
  console.log('✓ Added CASCADE constraint for indicatorId');
}

export async function down(queryInterface: QueryInterface, Sequelize: typeof DataTypes): Promise<void> {
  // Удаляем ограничения с CASCADE
  await queryInterface.removeConstraint('"complex-staged_indicators"', 'complex-staged_indicators_complexId_fkey');
  await queryInterface.removeConstraint('"complex-staged_indicators"', 'complex-staged_indicators_indicatorId_fkey');
  console.log('✓ Removed CASCADE constraints');

  // Восстанавливаем без CASCADE (если нужно)
  await queryInterface.addConstraint('"complex-staged_indicators"', {
    fields: ['complexId'],
    type: 'foreign key',
    name: 'complex-staged_indicators_complexId_fkey',
    references: {
      table: 'complexes',
      field: 'id'
    },
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE'
  });

  await queryInterface.addConstraint('"complex-staged_indicators"', {
    fields: ['indicatorId'],
    type: 'foreign key',
    name: 'complex-staged_indicators_indicatorId_fkey',
    references: {
      table: 'staged_indicators',
      field: 'id'
    },
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE'
  });
  console.log('✓ Restored constraints without CASCADE');
}