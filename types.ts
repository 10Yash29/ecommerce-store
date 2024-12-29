export interface Billboard{
    id:string
    label: string,
    imageUrl: string,
}

export interface Category{
    id: string
    name: string,
    billboard: Billboard
}

export interface Products{
    id: string
    name: string,
    size: Size,
    category: Category
    color: Color,
    price: string,
    isFeatured: boolean,
    images: image[]
}

export interface Size{
    id: string
    name: string,
    value: string
}

export interface Color{
    id: string
    name: string,
    value: string
}

export interface image{
    id: string
    url: string,
}