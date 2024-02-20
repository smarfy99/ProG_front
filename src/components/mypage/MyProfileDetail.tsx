import React, { useEffect, useState } from 'react';
import { axiosInstance } from '../../apis/lib/axios';
import ChangePwInfo from '../alarm/ChangePwInfo.tsx';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../../stores/useUserStore.ts';

interface ProfileData {
	email: string;
	name: string;
	nickname: string;
	description: string;
	imgUrl: string;
}

const MyProfileDetail = () => {
	const [changeName, setChangeName] = useState<string>('');
	const [changeNickname, setChangeNickname] = useState<string>('');
	const [changeDescription, setChangeDescription] = useState<string>('');
	const [isEditMode, setIsEditMode] = useState<boolean>(false);
	const [selectedImage, setSelectedImage] = useState<File | null>(null);
	const [currentPassword, setCurrentPassword] = useState('');
	const [newPassword, setNewPassword] = useState('');
	const [confirmNewPassword, setConfirmNewPassword] = useState('');
	const [showModal, setShowModal] = useState(false);
	const [withdrawalModal, setWithdrawalModal] = useState(false);
	const [message, setMessage] = useState('');
	const [profileData, setProfileData] = useState<ProfileData>({
		email: '',
		name: '',
		nickname: '',
		description: '',
		imgUrl: '',
	});
	const [loadProfile, setLoadProfile] = useState<boolean>(true); // 프로필 데이터를 불러올지 여부를 결정하는 상태
	const profile = useUserStore((state) => state.profile);
	const setProfile = useUserStore((state) => state.setProfile);
	const navigate = useNavigate();

	useEffect(() => {
		profileGet();
	}, [loadProfile]);

	const profileGet = async () => {
		try {
			const response = await axiosInstance.get(`members/detail-profile/${profile?.id}`); // 지금 여기 id로 바뀜

			const data = response.data.data;

			setProfileData({
				email: data.email,
				name: data.name,
				nickname: data.nickname,
				description: data.description,
				imgUrl: data.imgUrl,
			});
		} catch (error) {
		} finally {
			setLoadProfile(false);
		}
	};

	const toggleEditMode = () => {
		setIsEditMode(!isEditMode);

		if (!isEditMode) {
			setChangeName(profileData.name);
			setChangeNickname(profileData.nickname);
			setChangeDescription(profileData.description);
		}
	};

	const changeProfile = async () => {
		const profileData = {
			id: profile?.id,
			name: changeName,
			nickname: changeNickname,
			description: changeDescription,
			memberTechDtoList: [],
		};

		const form = new FormData();
		const formData = JSON.stringify(profileData);
		form.append('member', new Blob([formData], { type: 'application/json' }));

		if (selectedImage) {
			form.append('file', selectedImage, selectedImage.name);
		}

		try {
			await axiosInstance.patch('/members/update-profile', form, {});

			const response = await axiosInstance.get('/members/my-profile');

			setProfile(response.data.data);
			setMessage('정보가 수정되었습니다.');
			setShowModal(true);
			setIsEditMode(!isEditMode);
			setLoadProfile(true);
		} catch (error) {
			setMessage(error?.response.data.message);
			setShowModal(true);
		}
	};

	const chkNickNameDuplication = async () => {
		try {
			await axiosInstance.post(`/members/nickname-validation-check/${profile?.id}`, {
				nickname: changeNickname,
			});
			setMessage('사용 가능한 닉네임 입니다.');
			setShowModal(true);
		} catch (error) {
			setMessage(error?.response.data.message);
			setShowModal(true);
		}
	};

	const validatePassword = (password: string): boolean => {
		const re = /^(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,16}$/;
		return re.test(password);
	};

	const isNewPasswordValid = validatePassword(newPassword);
	const doNewPasswordsMatch = newPassword === confirmNewPassword;

	const changePw = async () => {
		const pwData = {
			id: profile?.id,
			originPassword: currentPassword,
			updatePassword: newPassword,
			updatePasswordCheck: confirmNewPassword,
		};

		try {
			await axiosInstance.patch('/members/change-password', pwData);

			setMessage('비밀번호가 변경되었습니다.');
			setShowModal(true);
			setNewPassword('');
			setCurrentPassword('');
			setConfirmNewPassword('');
		} catch (error) {
			setMessage('비밀번호를 확인해 주세요.');
			setShowModal(true);
		}
	};

	const withdrawMember = async () => {
		try {
			await axiosInstance.delete(`/members/withdrawal-member${profile?.id}`);
			navigate('/');
		} catch (error) {
			setMessage(error?.response.data.message);
			setShowModal(true);
		}
	};

	const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files && event.target.files[0];
		if (file) {
			setSelectedImage(file);
		}
	};

	return (
		<div className='min-h-full max-w-xl mx-auto flex flex-col'>
			<div className='flex justify-center my-10'>
				<div className='relative'>
					<input id='imageInput' onChange={handleImageChange} type='file' className='hidden' />
					{selectedImage ? (
						<img
							src={URL.createObjectURL(selectedImage)}
							alt='Selected Preview'
							className='w-60 h-60 rounded-full object-cover'
						/>
					) : (
						<img src={profileData.imgUrl} alt='Profile' className='w-60 h-60 rounded-full object-cover' />
					)}
					{isEditMode && (
						<label
							htmlFor='imageInput'
							className='absolute inset-0 flex items-center justify-center bg-gray-200 bg-opacity-60 rounded-full cursor-pointer'
						>
							<span role='img' aria-label='Add Icon' className='text-2xl'>
								➕
							</span>
						</label>
					)}
				</div>
			</div>
			<div className='bg-white shadow rounded-lg p-6 border-gray-500'>
				<div className='text-center mb-8'>
					<p className='text-3xl font-bold'>{profileData.nickname}`s Profile</p>
				</div>

				<div className='flex flex-col'>
					{/* 이메일 필드 */}
					<div className='flex mb-10'>
						<span className='text-xl font-semibold text-main-color mr-3 w-1/5'>이메일</span>
						<span className='font-bold text-xl'>{profileData.email}</span>
					</div>
					{/* 이름 필드 */}
					<div className='flex mb-10 items-center'>
						<span className='text-xl font-semibold text-main-color mr-3 w-1/5'>이름</span>
						{isEditMode ? (
							<input
								value={changeName}
								onChange={(e) => setChangeName(e.target.value)}
								className='font-bold text-xl form-input mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 flex-1'
							/>
						) : (
							<span className='text-xl font-bold'>{profileData.name}</span>
						)}
					</div>

					{/* 닉네임 필드 */}
					<div className='flex mb-10 items-center'>
						<span className='text-xl font-semibold text-main-color mr-3 w-1/5'>닉네임</span>
						{isEditMode ? (
							<>
								<input
									value={changeNickname}
									onChange={(e) => setChangeNickname(e.target.value)}
									className='text-xl font-bold form-input mt-1 block w-full rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 flex-1 border-gray-300'
								/>
								<button
									onClick={chkNickNameDuplication}
									className='bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ml-2 block text-base'
								>
									검사
								</button>
							</>
						) : (
							<span className='font-bold text-xl'>{profileData.nickname}</span>
						)}
					</div>

					{/* 나의 소개 */}
					<div className='flex mb-10 items-center'>
						<span className='text-xl font-semibold text-main-color mr-3 w-1/5'>소개</span>
						{isEditMode ? (
							<textarea
								value={changeDescription}
								onChange={(e) => setChangeDescription(e.target.value)}
								className='text-xl form-textarea mt-1 block w-full rounded-md font-bold shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 flex-1'
							/>
						) : (
							<span className='font-bold text-xl'>{profileData.description}</span>
						)}
					</div>
				</div>
				<div className='flex text-base'>
					{isEditMode ? (
						<button
							className='flex-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ml-auto block'
							onClick={changeProfile}
						>
							저장
						</button>
					) : (
						<button
							className='flex-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-2 ml-auto block'
							onClick={toggleEditMode}
						>
							수정
						</button>
					)}
				</div>
			</div>

			<div className='mt-10 bg-white shadow rounded-lg p-6 border-gray-500'>
				<div className='' onClick={(e) => e.stopPropagation()}>
					<div className='flex justify-center'>
						<div className='text-xl font-bold mb-4'>비밀번호 변경</div>
						<ChangePwInfo />
					</div>
					<div className='mb-4'>
						<label htmlFor='currentPassword' className='block mb-2 text-sm font-bold text-gray-700'>
							현재 비밀번호
						</label>
						<input
							type='password'
							id='currentPassword'
							className='w-full p-2 border border-gray-300 rounded'
							value={currentPassword}
							onChange={(e) => setCurrentPassword(e.target.value)}
						/>
					</div>

					<div className='mb-4'>
						<label htmlFor='newPassword' className='block mb-2 text-sm font-bold text-gray-700'>
							변경할 비밀번호
						</label>
						<input
							type='password'
							id='newPassword'
							className={`w-full p-2 border ${isNewPasswordValid ? 'border-green-500' : 'border-red-500'} rounded`}
							value={newPassword}
							onChange={(e) => setNewPassword(e.target.value)}
						/>
					</div>

					<div className='mb-4'>
						<label htmlFor='confirmNewPassword' className='block mb-2 text-sm font-bold text-gray-700'>
							변경 비밀번호 확인
						</label>
						<input
							type='password'
							id='confirmNewPassword'
							className={`w-full p-2 border ${
								doNewPasswordsMatch && isNewPasswordValid ? 'border-green-500' : 'border-red-500'
							} rounded`}
							value={confirmNewPassword}
							onChange={(e) => setConfirmNewPassword(e.target.value)}
						/>
					</div>

					<div className='flex justify-end'>
						<button onClick={changePw} className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>
							변경하기
						</button>
					</div>
				</div>
			</div>

			<button className='mt-10 bg-red-200 shadow rounded-lg py-2 px-4 text-xl' onClick={() => setWithdrawalModal(true)}>
				탈퇴하기
			</button>

			{showModal && (
				<div
					className='fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center'
					id='my-modal'
				>
					<div className='relative mx-auto p-5 border w-96 shadow-lg rounded-md bg-white'>
						<div className='mt-3 text-center'>
							<h3 className='text-lg leading-6 font-medium text-gray-900'>{message}</h3>
							<div className='mt-2 px-7 py-3'></div>
							<div className='items-center px-4 py-3'>
								<button
									id='ok-btn'
									onClick={() => setShowModal(false)}
									className='px-4 py-2 bg-main-color text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-blue-400 focus:outline-none focus:ring-2 focus:ring-green-300'
								>
									확인
								</button>
							</div>
						</div>
					</div>
				</div>
			)}
			{withdrawalModal && (
				<div className='fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full' id='my-modal'>
					<div className='relative top-80 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white'>
						<div className='mt-3 text-center'>
							<h3 className='text-lg leading-6 font-medium text-gray-900'>정말로 탈퇴하시겠습니까?</h3>
							<div className='mt-2 px-7 py-3'>
								<p className='text-sm text-gray-500'>이 작업은 되돌릴 수 없습니다.</p>
							</div>
							<div className='items-center px-4 py-3'>
								<button
									onClick={withdrawMember}
									className='mt-3 mr-2 px-4 py-2 bg-red-600 text-white text-base font-medium rounded-md w-30 shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500'
								>
									탈퇴하기
								</button>
								<button
									onClick={() => setWithdrawalModal(false)}
									className='px-4 py-2 bg-gray-500 text-white text-base font-medium rounded-md w-20 shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300'
								>
									취소
								</button>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default MyProfileDetail;
