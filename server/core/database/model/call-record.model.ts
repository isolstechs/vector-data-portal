import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Index,
  Model,
  Table,
} from 'sequelize-typescript';
import { PrefixModel } from './prefix.model';

@Table({ modelName: 'call-record' })
export class CallRecordModel extends Model {
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

  @Index
  @Column(DataType.DATE)
  date: string;

  @Column(DataType.STRING)
  sessionTime: string;

  // relationship with PrefixModel
  @ForeignKey(() => PrefixModel)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  prefixId: number;

  @BelongsTo(() => PrefixModel, {
    foreignKey: { allowNull: true },
    onDelete: 'cascade',
  })
  prefix: PrefixModel;
}
