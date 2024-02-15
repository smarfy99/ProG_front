import { useNavigate } from 'react-router-dom';
import errorImage from '../../assets/Error.jpg';

function ErrorPage() {
	const navigate = useNavigate();

	return (
		<div className='flex flex-col items-center justify-center h-full'>
			<img src={errorImage} alt='Error' className='max-w-full h-auto md:max-w-2xl' />
			<button
				onClick={() => navigate('/')}
				className='mt-5 bg-main-color hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
			>
				홈으로 가기
			</button>
		</div>
	);
}

export default ErrorPage;
