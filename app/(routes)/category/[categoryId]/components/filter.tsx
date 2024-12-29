'use client'
import {Color, Size} from "@/types";
import {useRouter, useSearchParams} from "next/navigation";
import {Button} from "@/components/ui/button";
import {cn} from "@/lib/utils";

interface FilterProps {
    data: (Size|Color)[]
    valueKey: string
    name: string
}

const Filter = ({data, valueKey, name}:FilterProps) => {

    const searchParams = useSearchParams();
    const router = useRouter();

    const selectedValue = searchParams.get(valueKey);

    const onClick = (id: string) => {
        const current = new URLSearchParams(searchParams.toString());
        const value = current.get(valueKey);

        if (value === id) {
            current.delete(valueKey);
        } else {
            current.set(valueKey, id);
        }

        const search = current.toString();
        const query = search ? `?${search}` : "";

        router.push(`${window.location.pathname}${query}`);
    };
    return(
        <div className="mb-8">
            <h3 className="text-lg font-semibold">{name}</h3>
            <hr className="my-4"/>
            <div className="flex flex-wrap gap-2">
                {data.map(filter => (
                    <div key={filter.id} className="flex items-center">
                        <Button className={cn("rounded-md text-sm bg-white border border-gray-600 p-2 text-gray-900", selectedValue===filter.id && "bg-black text-white")}
                                onClick={()=>onClick(filter.id)}>{filter.name}</Button>
                    </div>

                ))}
            </div>
        </div>
    );
};
export default Filter;