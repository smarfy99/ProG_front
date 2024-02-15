import React, { useEffect, useState } from 'react';
import { useUserStore } from '../../stores/useUserStore.ts';
import { axiosInstance } from '../../apis/lib/axios.ts';
import ImageWithFallback from '../../utils/DefaultImgage.tsx';

interface NestedCommentProps {
	contentCode: string;
	contentId?: string;
	parentId: number;
}

const NestedComment: React.FC<NestedCommentProps> = ({ contentCode, contentId, parentId }) => {
	const { profile } = useUserStore();
	const [comments, setComments] = useState([]);
	const [newComment, setNewComment] = useState('');
	const [editedComment, setEditedComment] = useState<string[]>([]);
	const [showEditor, setShowEditor] = useState<boolean[]>([]);
	const memberId = profile?.id;

	useEffect(() => {
		fetchComments();
	}, []);

	const fetchComments = async () => {
		try {
			const response = await axiosInstance.get(`/comments/${parentId}/children`, {});

			setComments(response.data.data);
		} catch (error) {
			console.log(error);
		}
	};

	const addComment = async () => {
		try {
			await axiosInstance.post('/comments', {
				contentCode: contentCode,
				contentId: contentId,
				memberId: memberId,
				parentId: parentId,
				content: newComment,
			});

			fetchComments();

			setNewComment('');
		} catch (error) {
			console.log(error);
		}
	};

	const updateComment = async (commentId: number, index: number) => {
		try {
			await axiosInstance.patch(`/comments/${commentId}/${memberId}`, {
				content: editedComment[index],
			});

			changeEditor(index, '');
			fetchComments();
		} catch (error) {
			console.log(error);
		}
	};

	const deleteComment = async (commentId: number) => {
		try {
			await axiosInstance.delete(`/comments/${commentId}/${memberId}`);

			fetchComments();
		} catch (error) {
			console.log(error);
		}
	};

	const changeEditor = (index: number, content: string) => {
		setShowEditor((prev) => {
			const newState = [...prev];
			newState[index] = !newState[index];
			return newState;
		});
		setEditedComment((prev) => {
			const newEditedCommentContents = [...prev];
			newEditedCommentContents[index] = content;
			return newEditedCommentContents;
		});
	};

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
		<div className='bg-gray-100'>
			{comments.map((comment, index) => (
				<div className='flex flex-col px-5 py-2' key={comment.id}>
					<div className='px-2 py-2'>
						<div className='flex items-center'>
							<ImageWithFallback
								src={comment.member.imgUrl}
								alt='Profile'
								type='member'
								style='flex-none w-12 h-12 rounded-full'
							/>
							<div className='flex-initial w-full mx-3'>
								<p className='font-bold'>{comment.member.nickname}</p>
								<p className='text-xs'>
									{comment.createdAt === comment.modifiedAt
										? formatDate(comment.createdAt)
										: formatDate(comment.modifiedAt) + ' (수정됨)'}
								</p>
							</div>
							{!comment.isDeleted && comment.member.id === memberId && (
								<div className='flex-initial w-32'>
									<button className='p-2 text-sm rounded' onClick={() => changeEditor(index, comment.content)}>
										수정
									</button>
									<button className='p-2 text-sm rounded' onClick={() => deleteComment(comment.id)}>
										삭제
									</button>
								</div>
							)}
						</div>
					</div>
					<div className='p-2'>
						{comment.isDeleted ? (
							<p className='text-gray-500 italic'> ❗️삭제된 댓글입니다.</p>
						) : !showEditor[index] ? (
							<p>
								{' '}
								{comment.content.split('\n').map((line, index) => (
									<React.Fragment key={index}>
										{line}
										<br />
									</React.Fragment>
								))}{' '}
							</p>
						) : (
							<div className='my-3'>
								<div className='flex flex-col'>
									<textarea
										id='comment'
										name='comment'
										value={editedComment[index]}
										onChange={(e) =>
											setEditedComment((prev) => {
												const newEditedCommentContents = [...prev];
												newEditedCommentContents[index] = e.target.value;
												return newEditedCommentContents;
											})
										}
										className='flex-none h-20 w-full mr-2 p-2 my-2 resize-none rounded border border-gray-300'
										placeholder='댓글을 입력하세요'
									/>
									<div className='flex justify-end space-x-2'>
										<button
											className='bg-main-color text-white p-2 w-20 rounded'
											onClick={() => updateComment(comment.id, index)}
										>
											저장
										</button>
										<button className='bg-red-400 text-white p-2 w-20 rounded' onClick={() => changeEditor(index, '')}>
											취소
										</button>
									</div>
								</div>
							</div>
						)}
					</div>
					<hr />
				</div>
			))}
			<div className='px-5 py-2'>
				<div className='flex flex-col p-2'>
					<div className='flex'>
						<ImageWithFallback
							src={profile?.imgUrl || ''}
							alt='Profile'
							type='member'
							style='flex-none w-12 h-12 rounded-full'
						/>
						<div className='flex-initial w-full mx-3 my-3.5'>
							<p className='font-bold'>{profile?.nickname}</p>
						</div>
					</div>

					<textarea
						id='comment'
						name='comment'
						value={newComment}
						onChange={(e) => setNewComment(e.target.value)}
						className='flex-none h-20 w-full mr-2 p-2 my-2 resize-none rounded border border-gray-300'
						placeholder='댓글을 입력하세요'
					/>
					<button className='bg-main-color text-white p-2 w-20 rounded ml-auto' onClick={addComment}>
						작성
					</button>
				</div>
			</div>
		</div>
	);
};

export default NestedComment;
