import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

import { BidModel } from 'infrastructure/typeorm/entities/Bid';
import { CustomBaseEntity } from 'infrastructure/typeorm/entities/CustomBaseEntity';
import { UserModel } from 'infrastructure/typeorm/entities/User';
import { VehicleModel } from 'infrastructure/typeorm/entities/Vehicle';

@Entity({ name: 'publications' })
export class PublicationModel extends CustomBaseEntity {
  @ManyToOne(() => UserModel, (user) => user.publications)
  @JoinColumn({ name: 'user_id' })
  user!: UserModel;

  @ManyToOne(() => VehicleModel, (vehicle) => vehicle.publications)
  @JoinColumn({ name: 'vehicle_id' })
  vehicle!: VehicleModel;

  @ManyToOne(() => UserModel, (user) => user.wonPublications)
  @JoinColumn({ name: 'winner_id' })
  winner?: UserModel;

  @OneToMany(() => BidModel, (bid) => bid.publication)
  bids!: BidModel[];

  @Column({ name: 'end_date' })
  endDate!: Date;
}
