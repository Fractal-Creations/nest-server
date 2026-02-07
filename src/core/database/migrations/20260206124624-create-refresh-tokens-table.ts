import { DataTypes } from "sequelize";


module.exports = {
  up: async (queryInterface) => {
    await queryInterface.createTable('refresh_tokens', {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      token: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      expiresAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    });

    // Add foreign key constraint separately
    await queryInterface.addConstraint('refresh_tokens', {
      fields: ['userId'],
      type: 'foreign key',
      name: 'fk_refresh_tokens_user_id',
      references: {
        table: 'users',
        field: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  },

  down: async (queryInterface) => {
    await queryInterface.removeConstraint('refresh_tokens', 'fk_refresh_tokens_user_id');
    await queryInterface.dropTable('refresh_tokens');
  },
};