// RecruitCard.tsx
import { Link } from 'react-router-dom';
import useRecruitStore from '../../stores/useRecruitStore';
import { FaEye, FaHeart } from "react-icons/fa6";
import logo from "../../assets/logo.png"

const RecruitCard = () => {
  const { searchResults } = useRecruitStore();

  return (
    <div className='flex flex-wrap'>
      {searchResults.map((result) => (
        <div key={result.id} className='relative shadow-xl w-64 h-80 grid place-items-center m-3 border-2 border-[var(--main-color30)] rounded-xl overflow-hidden transition-all duration-300 ease-in-out hover:border-black hover:rounded-lg hover:-translate-y-2 hover:shadow-[0_0.8rem_0_0_var(--gray100)]'>
          <Link
            to={`/recruit/project/${result.id}`}
            onClick={() => window.scrollTo({ top: 0 })}
          >
          <div className='flex justify-between w-auto mt-2'>
            <span className={` text-black font-bold px-2 py-1 rounded-lg ${
                result.statusCode.detailDescription === '모집중' ? 'bg-yellow-200' :
                result.statusCode.detailDescription === '진행중' ? 'bg-green-200' :
                result.statusCode.detailDescription === '완료' ? 'bg-red-200' : ''}`}>
              {result.statusCode.detailDescription}
            </span>
            <div className='mx-3 bg-sub-color text-black font-bold px-2 py-1 rounded-lg flex h-8'>
              <span className='mx-1 pt-1'><FaEye /></span> <span>{result.viewCnt}</span>
            </div>
            <div className={`mx-1 text-black font-bold px-2 py-1 rounded-lg flex h-8 bg-sub-color`}>
              <span className='mx-1 pt-1'><FaHeart /></span> <span>{result.likeCnt}</span>
            </div>
          </div>

          <img src={result.projectImgUrl || logo} alt='Project Thumbnail' className='w-56 h-32 mt-2' />

          <div className='font-bold w-56'>{truncate(result.title, 14)}</div>
          <div className='flex flex-wrap justify-center w-56 h-20 my-1'>
            {result.techCodes.slice(0, 6).map((tag) => (
              <span key={tag.id} className='mr-2 p-1 bg-sub-color text-black rounded-lg mb-1 h-8'>
                {tag.detailName}
              </span>
            ))}
          </div>
            <div className='text-gray-600 font-semibold ml-7 mb-3'>
              모집인원 {result.current}/{result.total}
          </div>
            </Link>
        </div>


      ))}
    </div>
  );
};

export default RecruitCard;

const truncate = (str: string, n: number) => {
  return str?.length > n ? str.substr(0, n - 1) + "..." : str;
};
