import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { DataModel } from './data.model';
import { OperatorModel } from './operator.model';

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

  @Column(DataType.STRING)
  prefix: string;

  // relationship with OperatorModel
  @HasMany(() => OperatorModel, {
    foreignKey: { allowNull: false },
  })
  operators: OperatorModel[];

  // relationship with DataModel
  @HasMany(() => DataModel, {
    foreignKey: { allowNull: false },
  })
  data: DataModel[];
}
