import React, { useState, ChangeEvent, useEffect } from 'react';
import TechStack, { techStack } from '../../components/techstack/TechStackRecruit';
import Position, { position } from '../../components/position/Position';
import { useNavigate } from 'react-router-dom';
import { axiosInstance } from "../../apis/lib/axios";
import { useRequireAuth } from '../../hooks/useRequireAuth';
import { useUserStore } from '../../stores/useUserStore';


interface State {
  projectTitle: string;
  projectContent: string;
  projectImage: File | null;
  projectPeriodNum: number;
  projectPeriodUnit: string;
}

const RecruitWritePage: React.FC = () => {
  useRequireAuth();
  const { profile } = useUserStore();
  const memberId = profile?.id;
  const navigate = useNavigate();
  const [state, setState] = useState<State>({
    projectTitle: '',
    projectContent: '',
    projectImage: null,
    projectPeriodNum: 0,
    projectPeriodUnit: '주',
  });
  const [formImage, setFormImage] = useState<File | null>(null);
  const [isModalVisible, setModalVisible] = useState(false);
  useEffect(() => {
    return () => {
      techStack.mystack = [];
      position.totalList = [];
    };
  }, []);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'projectPeriodNum') {
      setState((prev) => ({
        ...prev,
        projectPeriodNum: parseInt(value, 10) || 0,
      }));
    } else {
      setState((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null; // 파일이 없으면 null을 반환
    console.log(file);
    setFormImage(file);
    console.log(formImage);
    if (file) {
      // const imageUrl = URL.createObjectURL(file);
      setState((prev) => ({
        ...prev,
        projectImage: file,
      }));
    }
  };

  const handleSave = async () => {
    const { projectTitle, projectContent } = state;

    if (projectTitle === '') {
      alert('제목을 입력해주세요.');
      return;
    } else if (projectContent === '') {
      alert('본문을 입력해주세요.');
      return;
    } else if (position.totalList.length === 0) {
      alert('한 개 이상의 포지션을 입력해주세요.');
      return;
    } else {
      let periodCal;
      if (state.projectPeriodUnit === '달') {
        periodCal = state.projectPeriodNum * 4;
      } else {
        periodCal = state.projectPeriodNum;
      }

      const projectData = {
        title: projectTitle,
        content: projectContent,
        period: periodCal,
        totechList: [...techStack.mystack], // 객체 복사
        totalList: position.totalList,
      };
      console.log(projectData);
      console.log(projectData.totalList);
      let currentCheck=0;
      for(let i=0; i<projectData.totalList.length; i++){
        if(projectData.totalList[i].current==1){
          currentCheck=1;
        }
      }
      console.log(currentCheck);
      if(currentCheck==0){
        alert('내가 참여할 포지션을 선택해주세요.');
        return;
      }
      const projectDataString = JSON.stringify(projectData);
      const form = new FormData();
      form.append('post', new Blob([projectDataString], { type: 'application/json' }));
      if (state.projectImage !== null) {
        form.append('file', state.projectImage);
        // form.append('file', )
      }
      console.log(projectDataString);
      console.log('FormData entries:');
      for (const pair of form.entries()) {
        console.log(pair[0] + ': ' + pair[1]);
      }
      console.log(memberId);
      try {
        const response = await axiosInstance.post(`/projects/${memberId}`, form, {
          headers: {
            'Content-Type': undefined,
          },
        });
        console.log("Response:", response);
        setModalVisible(true);
      } catch (error) {
        console.error("Post failed:", error);
      }
    }
  };
  const closeModal = () => {
    // Close the modal
    setModalVisible(false);
    navigate('../recruit/');
    window.scrollTo({ top: 0 });
  };

  return (
    <div className='w-full h-max grid place-items-center'>
      <div className='bg-sub-color w-screen h-20 justify-center flex items-center font-bold text-4xl'>
        새 프로젝트 생성
      </div>
      <div className='w-9/12 h-auto p-16 m-5 shadow-2xl rounded-2xl'>
        <div>
          <label htmlFor='projectTitle' className='font-bold text-3xl my-3'>
            프로젝트 제목
          </label>
          <hr className='my-3 border-main-color border-1' />
          <div>
            <input
              type='text'
              id='projectTitle'
              name='projectTitle'
              className='w-full h-10 mb-10'
              placeholder='제목을 입력해 주세요'
              onChange={handleInputChange}
            />
          </div>
        </div>
        <div className='my-3'>
          <label htmlFor='projectContent' className='font-bold text-3xl '>
            프로젝트 내용
          </label>
          <hr className='my-3 border-main-color border-1' />
          <div>
            <textarea
              id='projectContent'
              name='projectContent'
              className='w-full h-40 mb-10'
              placeholder='내용을 입력해 주세요'
              onChange={handleInputChange}
            />
          </div>

          <TechStack />

          <div className='my-3'>
            <label className='font-bold text-3xl'>
              프로젝트 이미지 업로드
            </label>
            <hr className='my-3 border-main-color border-1' />
            <div>
              <input
                type='file'
                id='projectImage'
                name='projectImage'
                accept='image/*'
                onChange={handleImageChange}
                className='w-max mt-2 mb-10'
              />
              {state.projectImage && typeof state.projectImage === 'object' ? (
                <img src={URL.createObjectURL(state.projectImage)} alt='Uploaded' className='mt-2 max-h-40' />
              ) : null}
            </div>
          </div>

          <div className='my-3'>
            <label htmlFor='projectPeriod' className='font-bold text-3xl my-3'>
              프로젝트 기간
            </label>
            <hr className='my-3 border-main-color border-1' />
            <div>
              <input
                type='text'
                id='projectPeriodNum'
                name='projectPeriodNum'
                className='w-10 h-10 p-1 mb-2'
                placeholder='기간'
                onChange={handleInputChange}
              />
              주
              {state.projectPeriodNum > 52 && (
                <div className='text-red-500'>프로젝트 기간은 52주를 초과할 수 없습니다.</div>
              )}
            </div>
          </div>


          <Position />
        </div>
        <button onClick={handleSave} className='mt-5 bg-main-color text-white p-3'>
          저장
        </button>

        {isModalVisible && (
          <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center'>
            <div className='bg-white p-8'>
              <p>저장되었습니다!</p>
              <button onClick={closeModal}>닫기</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecruitWritePage;

