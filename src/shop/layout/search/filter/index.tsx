'use client'
import { FilterItem } from './item';
import styled from 'styled-components'


export type PathFilterItem = { title: string; path: string };

 
export default function FilterList({ list, title }: { list: PathFilterItem[]; title?: string }) {
  return (
    <>
      <Container>
        <ul className="hidden md:block">
         
        {list.map((item: PathFilterItem, i) => (
        <FilterItem key={i} item={item} />
      ))}
         
        </ul>
        
      </Container>
    </>
  );
}


////

const Container = styled.div`
 
   h4{
    margin: 0.4rem;
    color: #a1a4ad;
    font-family: 'Europa Grotesk';
    margin: 0 12px;
    color: #263349;
    text-transform: uppercase;
    transition: .2s ease-in-out;
  }
  
  .active2{
    h4{
      color: #d3d5db;
    }
  }
  .active{
    content: "";

    width: 50px;
    height: 9px;
    background-image: url(https://i.imgur.com/How1Q96.png);
    background-repeat: no-repeat;
    background-position: center;
    background-size: 100%;
    animation: fadeIn .7s ease-in-out;
  }

  ul{
      display: flex;
  flex-direction: row;
  align-items: center;
  }


  .click{
    cursor: var(--f-cursor-pointer);

    &:hover{
      h4{
      color: #d3d5db;
    }
    }
  }

 
`;