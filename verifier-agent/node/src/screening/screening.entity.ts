import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { ScreeningClaim } from './screening-claim.entity';

@Entity()
export class Screening {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  screenedOn: string;

  @Column()
  subject: string;

  @OneToMany(() => ScreeningClaim, (claim) => claim.screening, {
    cascade: true,
    eager: true
  })
  claims: ScreeningClaim[];
}
