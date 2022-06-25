import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { CountryModel } from './country.model';
import { DataModel } from './data.model';

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

  @Column(DataType.STRING)
  prefix: string;

  // relationship with CountryModel
  @ForeignKey(() => CountryModel)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  countryId: number;

  @BelongsTo(() => CountryModel, {
    foreignKey: { allowNull: true },
    onDelete: 'cascade',
  })
  country: CountryModel;

  // relationship with DataModel
  @HasMany(() => DataModel, {
    foreignKey: { allowNull: false },
  })
  data: DataModel[];
}
