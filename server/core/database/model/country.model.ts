import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { PrefixModel } from './prefix.model';

@Table({ modelName: 'country' })
export class CountryModel extends Model {
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    autoIncrement: true,
    unique: true,
    primaryKey: true,
  })
  id: number;

  @Column(DataType.STRING)
  name: string;

  @Column(DataType.INTEGER)
  numericCode: number;

  @Column(DataType.STRING)
  alphaCode: string;

  // relationship with PrefixModel
  @HasMany(() => PrefixModel, {
    foreignKey: { allowNull: false },
  })
  prefixes: PrefixModel[];
}
