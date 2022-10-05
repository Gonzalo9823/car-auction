import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { CustomBaseEntity } from 'infrastructure/typeorm/entities/CustomBaseEntity';
import { UserModel } from 'infrastructure/typeorm/entities/User';

@Entity({ name: 'vehicles' })
export class VehicleModel extends CustomBaseEntity {
  @Column({ name: 'license_plate', unique: true })
  licensePlate!: string;

  @Column()
  brand!: string;

  @Column()
  model!: string;

  @Column()
  year!: number;

  @Column()
  kilometers!: number;

  @Column()
  sold!: boolean;

  @ManyToOne(() => UserModel, (user) => user.vehicles)
  @JoinColumn({ name: 'owner_id' })
  owner!: UserModel;
}
