import React, { useEffect } from 'react';
import RecruitCard from '../../components/recruit/RecruitCard.tsx';
import RecruitSearchBar from '../../components/recruit/RecruitSearchBar.tsx';
import Pagination from '@mui/material/Pagination';
import useRecruitStore from '../../stores/useRecruitStore.ts';
import { useRequireAuth } from '../../hooks/useRequireAuth';

const RecruitPage: React.FC = () => {
  useRequireAuth();
  const { currentPage, setCurrentPage, totalPages } = useRecruitStore();

  const handlePageChange = (_event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
  };
  useEffect(() => {
    setCurrentPage(1);
    <RecruitSearchBar currentPage={1} />
    console.log(currentPage)
  }, []);
  return (
    <React.StrictMode>
      <div className='grid text-center'>
        <div className='font-bold text-6xl'>프로젝트 찾기</div>
        <RecruitSearchBar currentPage={currentPage} />
      </div>
      <div className='flex justify-center'>

        <div className='px-16 m-1 flex justify-start'>
          <RecruitCard />
        </div>
      </div>
      <div className='flex justify-center mb-10'>
        <Pagination
          count={totalPages}
          variant='outlined'
          shape='rounded'
          page={currentPage}
          onChange={handlePageChange}
          onClick={() => window.scrollTo({ top: 0 })}
        />
      </div>
    </React.StrictMode>
  );
};

export default RecruitPage;
