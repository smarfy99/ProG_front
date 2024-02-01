import { useState } from 'react';
import { Link } from 'react-router-dom';

const thumbnail = 'src/assets/react.svg';
const title = '프로젝트 제목';
const tags = ['JAVA', 'REACT', 'VITE', 'VUE', 'TypeScript', 'HTML', 'CSS', 'SASS', 'SCSS', 'JavaScript'];
const maxpeople = 6;
const nowpeople = 3;
const status = '모집중';

const RecruitCard = () => {
	const [like, setLike] = useState(0);
	const [liked, setLiked] = useState(false);

	const handleLikeClick = () => {
		if (liked) {
			setLike(like - 1);
		} else {
			setLike(like + 1);
		}
		setLiked(!liked);
	};

	return (
		<div className='relative bg-gray-100 w-64 h-auto grid place-items-center border-black border-2'>
			<div className='absolute top-2 left-5 bg-yellow-300 text-black font-bold px-2 py-1 rounded-lg'>{status}</div>
			<div
				className={`absolute top-2 right-5 text-black font-bold px-2 py-1 rounded-lg hover:cursor-pointer ${
					liked ? 'bg-pink-300' : 'bg-red-100'
				}`}
				onClick={handleLikeClick}
			>
				{liked ? '♥' : '♡'} {like}
			</div>
			<img src={thumbnail} alt='React logo' className='w-56 h-40 bg-sub-color' />
			<div className='font-bold'>{title}</div>
			<div className='flex flex-wrap'>
				{tags.slice(0, 3).map((tag, index) => (
					<span key={index} className='mr-2 p-1 bg-black text-white rounded-lg mb-1 hover:bg-pink-600'>
						#{tag}
					</span>
				))}
			</div>
			<div className='flex flex-wrap'>
				{tags.slice(3, 6).map((tag, index) => (
					<span key={index} className='mr-2 p-1 bg-black text-white rounded-lg mb-1 hover:bg-pink-600'>
						#{tag}
					</span>
				))}
			</div>
			<div className='flex-col items-center m-3'>
				<Link
					to='/recruit/project'
					className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-2 m-1 rounded-lg'
				>
					프로젝트 개요 보기
				</Link>
				<div className='text-gray-600 font-semibold ml-7 mt-5'>
					모집인원 {nowpeople}/{maxpeople}
				</div>
			</div>
		</div>
	);
};

export default RecruitCard;
