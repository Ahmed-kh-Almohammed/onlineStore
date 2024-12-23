import {
    Column,
    CreateDateColumn,
    Entity, OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import { Cur_TimeStamp } from "src/utils/constants";
import { Product } from "../products/products.entity"
import { Review } from "src/reviews/review.entity";
import { UserType } from "src/utils/enums";
import { Exclude } from "class-transformer";

@Entity({ name: "users" })
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "varchar", length: 150, nullable: true })
    username: string;

    @Column({ unique: true, type: 'varchar', length: 150 })
    email: string;

    @Column()
    @Exclude()
    password: string;

    @Column({ type: 'enum', enum: UserType, default: UserType.NORMAL_USER })
    userType: UserType;

    @Column({ default: false })
    isAccountVerified: boolean;

    @CreateDateColumn({ type: 'timestamp', default: () => Cur_TimeStamp })
    createdDate: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => Cur_TimeStamp, onUpdate: Cur_TimeStamp })
    updatedDate: Date;

    @Column({nullable:true,default:null})
    profileImage:string;

    @OneToMany(()=>Product,(Product)=>Product.user)
    products: Product[];

    @OneToMany(()=>Review,(r)=>r.user)
    reviews:Review[];

    

}