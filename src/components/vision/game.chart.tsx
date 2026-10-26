import Image from 'next/image';
import React from 'react'

interface Props {
    cown: React.ReactNode;
}

export default function ChartGame ({cown} : Props) {
    return(
        <>
  
  <div className="_provablyFairBlock_6hze1_7">
    <div className="_left_6hze1_34">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd"
                d="M9.00008 2.94775L2.948 5.18237C2.948 5.18237 2.94796 5.18237 3.81258 10.3965C4.24488 13.0034 6.62234 15.0518 8.99987 15.0519C11.3775 15.052 13.7553 13.0036 14.1876 10.3965L15.0522 5.18237L9.00008 2.94775ZM8.94141 10.5616L11.9675 7.91382L11.2202 7.05982L8.51863 9.42369L7.14992 8.52548L6.52732 9.4742L8.25649 10.609L8.61695 10.8455L8.94141 10.5616Z"
                fill="#EBF0FF">
            </path>
        </svg>
        <span className="_provablyFairText_6hze1_52">Provably fair</span>
        <span>protected</span>
    </div>
    <div className="_right_6hze1_40">
        {cown}
        <Image src={'/icons/facegraffiti.png'} alt='novision' height={30} width={30}/>
    </div>
</div>

 
        
        </>
    )
}