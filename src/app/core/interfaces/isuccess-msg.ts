export interface ISuccessMsg {
    message: string
    user: User
    token: string
}

export interface User {
    name: string
    email: string
    role: string
}
