import FeedDetail from './FeedDetail.tsx';
import React, { FC, useEffect, useState } from 'react';

type FreeFeedSimpleProps = {
	memberId: number;
	nickname: string;
	imgUrl: string;
	position: string;
	boardId: number;
	createdAt: string;
	isDeleted: boolean;
	title: string;
	viewCnt: number;
	isNotice: boolean;
	popFeeds?: (boardId: number, index: number) => void;
	index: number;
	getFreeFeeds: () => void;
};

const FreeFeedSimple: FC<FreeFeedSimpleProps> = ({
	nickname,
	imgUrl,
	position,
	boardId,
	createdAt,
	title,
	popFeeds,
	index,
	getFreeFeeds,
}) => {
	//보드 디테일 상태
	const [showDetail, setShowDetail] = useState(false);

	//수정 삭제 모달 생성
	const handleDetailClick = (event: React.MouseEvent) => {
		event.stopPropagation();
		setShowDetail(true);
	};

	//보드 디테일 모달 닫기 버튼
	const onClickClose = () => {
		setShowDetail(false);
	};

	useEffect(() => {
		if (showDetail) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = 'unset';
		}
	}, [showDetail]);

	const formatDate = (dateString: string): string => {
		const serverDateTime = new Date(dateString);

		const koreaDateTime = new Date(serverDateTime.getTime() + 9 * 60 * 60 * 1000);

		const formattedDateTime = `${koreaDateTime.getFullYear()}.${String(koreaDateTime.getMonth() + 1).padStart(
			2,
			'0',
		)}.${String(koreaDateTime.getDate()).padStart(2, '0')} ${String(koreaDateTime.getHours()).padStart(
			2,
			'0',
		)}:${String(koreaDateTime.getMinutes()).padStart(2, '0')}:${String(koreaDateTime.getSeconds()).padStart(2, '0')}`;

		return formattedDateTime;
	};
	return (
		<div onClick={handleDetailClick} className='gap-4 hover:bg-stone-50 p-4 h-24'>
			<div className='flex justify-between items-center'>
				<div className='flex'>
					<p>
						<img className='flex-none w-12 h-12 rounded-full' src={imgUrl} alt='Profile' />
					</p>
					<div className='grid ml-4'>
						<p className=''>{nickname}</p>
						<p className='text'>{position}</p>
					</div>
					<div className=' ml-4 mr-4 pl-4'>
						<p className='mt-2'>{title}</p>
						{showDetail && (
							<FeedDetail
								boardId={boardId}
								onClose={onClickClose}
								popFeeds={popFeeds}
								index={index}
								getFreeFeeds={() => getFreeFeeds()}
							/>
						)}
					</div>
				</div>
				<div className='flex gap-4'>
					<p>{formatDate(createdAt)}</p>
				</div>
			</div>
		</div>
	);
};

export default FreeFeedSimple;
