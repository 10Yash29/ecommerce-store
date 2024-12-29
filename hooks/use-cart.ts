import {Products} from "@/types";
import {create} from "zustand";
import {createJSONStorage, persist} from "zustand/middleware";
import toast from "react-hot-toast";

interface CardStore{
    items: Products[],
    addItem : (data: Products)=>void
    deleteItem: (id: string) => void
    deleteAll: ()=>void;
}

const useCart = create(
    persist<CardStore>((set,get)=>({
        items:[],
        addItem:(data:Products)=>{
            const currentItems = get().items;
            const existingItem = currentItems.find((item) => item.id === data.id);
            if(existingItem){
                return toast('Item already exists');
            }
            set({items: [...get().items, data]});
            toast.success("Item added to cart");
        },
        deleteItem(id:string){
            set({items: [...get().items.filter((item)=>item.id !== id)]});
        },
        deleteAll:()=>set({items:[]})
    }),{
        name:'Cart-Storage',
        storage:createJSONStorage(()=>localStorage)
    })
)
export default useCart;