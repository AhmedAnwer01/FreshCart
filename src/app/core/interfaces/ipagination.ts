import { IProduct } from "./iproduct"

export interface IPagination {
    id?: string
    currentPage: number
    numberOfPages: number
    limit: number
    pervPage?: number
    nextPage?: number
    totalItems?: number
    data: IProduct[]
}
