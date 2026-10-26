import styled from "styled-components";


export const Prose: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  return (
    <TextDescription>
     {children}
    </TextDescription>
  );
};


const TextDescription = styled.div`

   margin: 1em;
   max-width: 53em;
   color: #828388c5;
   font-size: 13px;
   margin-bottom: 2em;
  
   a{
    color: #5a5a646f;
   }
`;