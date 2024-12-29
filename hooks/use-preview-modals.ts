import {Products} from "@/types";
import {create} from "zustand";

interface PreviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    data?: Products
    onOpen: (data: Products) => void;
}

const usePreviewModal = create<PreviewModalProps>((set)=>({
    isOpen: false,
    data:undefined,
    onOpen:(data) => set({data, isOpen: true}),
    onClose: () => set({isOpen: false}),
}));

export default usePreviewModal;