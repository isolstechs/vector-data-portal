import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { CallRecordModel } from './call-record.model';
import { CountryModel } from './country.model';
import { OperatorModel } from './operator.model';

@Table({ modelName: 'prefix' })
export class PrefixModel extends Model {
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    autoIncrement: true,
    unique: true,
    primaryKey: true,
  })
  id: number;

  @Column(DataType.INTEGER)
  code: number;

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

  // relationship with CallRecordModel
  @HasMany(() => CallRecordModel, {
    foreignKey: { allowNull: false },
    onDelete: 'cascade',
  })
  callRecords: CallRecordModel[];
}
