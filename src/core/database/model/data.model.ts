import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { CountryModel } from './country.model';
import { OperatorModel } from './operator.model';

@Table({ modelName: 'data' })
export class DataModel extends Model {
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @Column(DataType.STRING)
  aParty: string;

  @Column(DataType.STRING)
  bParty: string;

  @Column(DataType.STRING)
  data: string;

  @Column(DataType.STRING)
  sessionTime: string;

  // relationship with CountryModel
  @ForeignKey(() => CountryModel)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  countryId: number;

  @BelongsTo(() => CountryModel, {
    foreignKey: { allowNull: false },
    onDelete: 'cascade',
  })
  country: CountryModel;

  // relationship with OperatorModel
  @ForeignKey(() => OperatorModel)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  operatorId: number;

  @BelongsTo(() => OperatorModel, {
    foreignKey: { allowNull: false },
    onDelete: 'cascade',
  })
  operator: OperatorModel;
}
