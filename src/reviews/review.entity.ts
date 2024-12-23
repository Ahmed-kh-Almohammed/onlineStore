import {
    Column,
    CreateDateColumn,
    Entity, ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import { Cur_TimeStamp } from "src/utils/constants";
import { Product } from '../products/products.entity'
import { User } from "src/users/user.entity";
@Entity({name:"reviews"})
export class Review {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'int' })
    rating: number;

    @Column()
    comment: string;


    @CreateDateColumn({ type: 'timestamp', default: () => Cur_TimeStamp })
    createdDate: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => Cur_TimeStamp, onUpdate: Cur_TimeStamp })
    updatedDate: Date;
    @ManyToOne(()=>Product,(product)=>product.reviews,{onDelete:"CASCADE"})
    product: Product;

    @ManyToOne(()=>User,(u)=>u.reviews,{eager:true,onDelete:"CASCADE"})
    user:User;
}