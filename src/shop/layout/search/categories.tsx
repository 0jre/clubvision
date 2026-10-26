'use client';
import { Suspense } from 'react';
import FilterList, { PathFilterItem } from './filter';
import { getCategoryList } from './getCategoryList';
import { useRef, useState, useEffect } from 'react';
import { CardViewList } from '@/styles/styled.view';

export default function Categories() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categories, setCategories] = useState<PathFilterItem[]>([]);
  
  useEffect(() => {
    async function fetchCategories() {
      const categoryList = await getCategoryList();
      setCategories(categoryList);
    }
    fetchCategories();
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isModalOpen) {
      setIsDragging(true);
      setStartX(e.clientX);
      setScrollLeft(containerRef.current!.scrollLeft);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;

    if (!isModalOpen) {
      e.preventDefault();
      const x = e.clientX - startX;
      const walk = x * 1;
      containerRef.current!.scrollLeft = scrollLeft - walk;
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <Suspense>
      <CardViewList
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseUp}
        ref={containerRef}
      >
        {categories.length > 0 && <FilterList list={categories} title="" />}
      </CardViewList>
    </Suspense>
  );
}
