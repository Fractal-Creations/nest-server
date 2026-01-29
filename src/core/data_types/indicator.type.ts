import { DataTypes } from "sequelize";

// All DataTypes must inherit from DataTypes.ABSTRACT.
export class DataIndicatorType extends DataTypes.ABSTRACT {
  // toSql must return the SQL that will be used in a CREATE TABLE statement.
  toSql() {
    return 'enum_indicators_characteristicType';
  }
}