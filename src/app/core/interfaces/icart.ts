import { IcartProduct } from "./icart-product"

export interface ICart {
    status: string
    message: string
    numOfCartItems: number
    cartId: string
    data: Data
}

export interface Data {
    _id: string
    cartOwner: string
    products: ProductInfo[]
    createdAt: string
    updatedAt: string
    __v: number
    totalCartPrice: number
}

export interface ProductInfo {
    count: number
    _id: string
    product: IcartProduct
    price: number
}
