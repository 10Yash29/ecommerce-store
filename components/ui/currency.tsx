import {useEffect, useState} from "react";

export const formatter = new Intl.NumberFormat("en-IN", { // Use "en-IN" for Indian English locale
    style: "currency",
    currency: "INR",
});

interface CurrencyProps {
    value?:string | number
}



const Currency = ({value}:CurrencyProps)=>{

    const[isMounted, setIsMounted] = useState(false);
    useEffect(() => {
       setIsMounted(true)
    }, []);
    if(!isMounted){
        return null;
    }

    return (
        <div className="font-semibold">
            {formatter.format(Number(value))}
        </div>
    );
};
export default Currency;