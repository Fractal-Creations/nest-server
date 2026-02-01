// src/database/migrations/20260130120000-add-order-to-complex-staged-indicators.ts
import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface, Sequelize: typeof DataTypes): Promise<void> {
   // Шаг 1: Добавляем колонку как nullable
   await queryInterface.addColumn('complex-staged_indicators', 'order', {
       type: DataTypes.INTEGER,
       allowNull: true,
   });

  // Шаг 2: Заполняем значениями (нумеруем внутри каждого комплекса)
  // ❗ Кавычки в запросе "complex-staged_indicators" из-за того, что в названии есть дефис
  await queryInterface.sequelize.query(`
  WITH ordered AS (
    SELECT 
      "complexId", 
      "indicatorId",
      ROW_NUMBER() OVER (PARTITION BY "complexId" ORDER BY "indicatorId") - 1 AS new_order
    FROM "complex-staged_indicators" 
  )
  UPDATE "complex-staged_indicators" csi
  SET "order" = o.new_order
  FROM ordered o/*  */
  WHERE csi."complexId" = o."complexId" 
    AND csi."indicatorId" = o."indicatorId"
`);

  // Шаг 3: Делаем колонку NOT NULL
  await queryInterface.changeColumn('complex-staged_indicators', 'order', {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  });
}

export async function down(queryInterface: QueryInterface, Sequelize: typeof DataTypes): Promise<void> {
  await queryInterface.removeColumn('complex-staged_indicators', 'order');
}