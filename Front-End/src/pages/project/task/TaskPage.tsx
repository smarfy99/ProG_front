import { useState, useRef, useEffect, CSSProperties } from 'react';
import CommuteCalendar from '../../../components/calendar/CommuteCalendar';
import TaskList from '../../../components/task/TaskList';
import { useRequireAuth } from '../../../hooks/useRequireAuth';
import { useParams } from 'react-router-dom';

const TaskPage = () => {
	useRequireAuth();

	const params = useParams<{ projectId: string }>();
	const projectId = Number(params.projectId);
	let memberId = 0;

	// 로컬 스토리지에서 userProfile을 가져옴
	const userProfileKey = 'userProfile';
	const userProfileString = localStorage.getItem(userProfileKey);
	if (userProfileString) {
		const userProfile = JSON.parse(userProfileString);
		memberId = userProfile.id;
	}

	const [page, setPage] = useState<string>('캘린더');
	const calendarButtonRef = useRef<HTMLButtonElement>(null);
	const taskButtonRef = useRef<HTMLButtonElement>(null);
	const [highlightStyle, setHighlightStyle] = useState<React.CSSProperties>({});

	useEffect(() => {
		const calendarButton = calendarButtonRef.current;
		const taskButton = taskButtonRef.current;

		if (calendarButton && taskButton) {
			const newStyle: CSSProperties = {
				left: page === '캘린더' ? calendarButton.offsetLeft : taskButton.offsetLeft,
				width: page === '캘린더' ? calendarButton.offsetWidth : taskButton.offsetWidth,
			};
			setHighlightStyle(newStyle);
		}
	}, [page]);

	const handleSectionClick = (section: string) => {
		setPage(section);
	};

	const selectedButtonClass = 'text-main-color';

	return (
		<div className='relative'>
			<div className='flex justify-center items-center relative mt-20'>
				<button
					ref={calendarButtonRef}
					className={`font-sans text-2xl mb-2 mr-40 ${page === '캘린더' ? selectedButtonClass : ''}`}
					onClick={() => handleSectionClick('캘린더')}
				>
					캘린더
				</button>
				<button
					ref={taskButtonRef}
					className={`font-sans text-2xl ml-40 mb-2 ${page === '상세' ? selectedButtonClass : ''}`}
					onClick={() => handleSectionClick('상세')}
				>
					내 업무
				</button>
				<div
					className='absolute bottom-0 h-1 bg-main-color transition-all duration-1000'
					style={{ left: `${highlightStyle.left}px`, width: `${highlightStyle.width}px` }}
				></div>
			</div>
			<hr className='mt-5' />
			{page === '캘린더' && <CommuteCalendar projectId={projectId} memberId={memberId} w-auto />}
			{page === '상세' && <TaskList />}
		</div>
	);
};

export default TaskPage;
