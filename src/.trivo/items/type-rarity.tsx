
interface Typ {
    rarity: "CHAMPION" | "XPLAY" |  "AMIX" ;
    size?: string | `h-6 w-6`;
}

export default function TypeRaritity({rarity, size} : Typ) {
    return (
        <>

        {rarity == 'CHAMPION' && (
              <div className={size}><svg className="icon h-full w-full text-[#bea551]" viewBox="0 0 24 24"><path fill="currentColor" d="M12.192 23.704c-6.456 0-11.69-5.233-11.69-11.69 0-6.456 5.234-11.69 11.69-11.69 6.456 0 11.69 5.234 11.69 11.69 0 6.457-5.234 11.69-11.69 11.69Zm0-16.65-4.96 4.96 4.96 4.96 4.96-4.96-4.96-4.96Z"></path><circle cx="12.192" cy="11.949" r="6.541" fill="currentColor"></circle><path fill="#18080a" d="M9.127 8.38h6.13a.43.43 0 0 1 .349.177l1.644 2.26a.215.215 0 0 1-.016.273l-4.884 5.29a.214.214 0 0 1-.316 0L7.15 11.09a.215.215 0 0 1-.015-.272l1.644-2.26a.43.43 0 0 1 .348-.178Z"></path></svg></div>
        )}

        
{rarity == 'XPLAY' && (
        <div className={size}><svg className="icon h-full w-full text-[#ea4343]" viewBox="0 0 25 25"><circle cx="12.547" cy="12.478" r="11.693" fill="currentColor"></circle><path fill="#0d0818" d="M12.547 7.661a5.072 5.072 0 0 1 5.07 5.07 5.072 5.072 0 0 1-5.07 5.07 5.072 5.072 0 0 1-5.07-5.07 5.072 5.072 0 0 1 5.07-5.07Zm0 7.098a2.025 2.025 0 0 0 2.028-2.028 2.025 2.025 0 0 0-2.028-2.028 2.025 2.025 0 0 0-2.028 2.028c0 1.122.906 2.028 2.028 2.028Zm0-2.535c.278 0 .507.228.507.507a.508.508 0 0 1-.507.507.508.508 0 0 1-.507-.507c0-.279.228-.507.507-.507Z"></path></svg></div>
        )}
        
        {rarity == 'AMIX' && (
        <div className={size}><svg className="icon h-full w-full text-[#7051b9]" viewBox="0 0 24 25"><circle cx="12.04" cy="12.478" r="11.693" fill="currentColor"></circle><path fill="#231c11" d="M6.97 16.28h10.14v1.014H6.97V16.28Zm0-7.098 2.535 1.521 2.535-3.042 2.535 3.042 2.535-1.52v6.083H6.97V9.182Z"></path></svg></div>
        )}

        </>
    )
}
