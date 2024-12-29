import { Billboard as BillboardType } from "@/types";

interface BillboardProps {
    data: BillboardType
}

const Billboard = ({ data }: BillboardProps) => {
    return (
        <div className="p-4 sm:p-6 lg:p-8 rounded-xl overflow-hidden">
            <div
                className="rounded-xl relative aspect-square md:aspect-[2.4/1] overflow-hidden bg-cover bg-center h-100 w-full"
                style={{ backgroundImage: `url(${data?.imageUrl})` }}
            >
                <div className="absolute inset-0 bg-black bg-opacity-30"> {/* Add a semi-transparent overlay */}
                    <div className="h-full w-full flex flex-col justify-end items-start p-6 sm:p-8 lg:p-12">
                        <div className="font-extrabold text-4xl sm:text-6xl lg:text-7xl text-white max-w-xl drop-shadow-lg">
                            {data.label}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Billboard;