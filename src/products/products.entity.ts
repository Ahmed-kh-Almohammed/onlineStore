import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
}
    from "typeorm";
import {Cur_TimeStamp} from'../utils/constants'
import {Review}from '../reviews/review.entity'
import { User } from "src/users/user.entity";
@Entity({ name: "products" })
export class Product {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    description: string;

    @Column()
    price: number;

    @CreateDateColumn({ type: 'timestamp', default:()=> Cur_TimeStamp })
    createdDate: Date;

    @UpdateDateColumn({ type: 'timestamp', default:()=> Cur_TimeStamp, onUpdate: Cur_TimeStamp })
    updatedDate: Date;

    @OneToMany(()=>Review,(review)=>review.product,{eager:true})
    reviews:Review[];

    @ManyToOne(()=>User,(user)=>user.products,{eager:true})
    user:User;


}