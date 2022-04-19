import { Specification } from "../infra/typeorm/entities/Specification";

interface ICreateSpecificationsTDO {
    name: string;
    description: string;
}

interface ISpecificationsRepository {
    create({
        name,
        description,
    }: ICreateSpecificationsTDO): Promise<Specification>;
    findByName(name: string): Promise<Specification>;
    findByIds(ids: string[]): Promise<Specification[]>;
}

export { ICreateSpecificationsTDO, ISpecificationsRepository };
