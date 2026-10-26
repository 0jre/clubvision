 

export default function OpenCart({
  quantity
}: {
  className?: string;
  quantity?: number;
}) {
  return (
       <>
      {quantity ? (
             <>
          {quantity ? quantity : '0'}
        </>
      ) : null}
    </>
  );
}
