export abstract class CategoryAbstract {

    abstract findAll(): Promise<any>

    abstract findRandom(): Promise<any>

    abstract findBySlug(slug: string): Promise<any>

}