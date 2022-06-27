import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { PrefixModel } from './prefix.model';

@Table({ modelName: 'operator' })
export class OperatorModel extends Model {
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

  // relationship with PrefixModel
  @HasMany(() => PrefixModel, {
    foreignKey: { allowNull: false },
  })
  prefix: PrefixModel[];
}
