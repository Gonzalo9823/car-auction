import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany } from 'typeorm';

import { CustomBaseEntity } from 'infrastructure/typeorm/entities/CustomBaseEntity';
import { PublicationModel } from 'infrastructure/typeorm/entities/Publication';
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

  @ManyToOne(() => UserModel, (user) => user.vehicles, { nullable: false })
  @JoinColumn({ name: 'owner_id' })
  owner!: UserModel;

  @ManyToMany(() => UserModel, (user) => user.favorites)
  userFavorites!: UserModel[];

  @OneToMany(() => PublicationModel, (publication) => publication.vehicle)
  publications!: PublicationModel[];
}
