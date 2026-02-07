
import { QueryInterface, DataTypes } from 'sequelize';

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.addColumn('base-indicators', 'isEndToEnd', {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: 'Флаг сквозного индикатора'
    });
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.removeColumn('base-indicators', 'isEndToEnd');
  }
};