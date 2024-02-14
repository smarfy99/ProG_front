/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { FaGear,FaCircleUser } from 'react-icons/fa6';
import { useParams, useNavigate } from 'react-router-dom';
import { axiosInstance } from '../../../apis/lib/axios';
import { useRequireAuth } from '../../../hooks/useRequireAuth';
import { useUserStore } from '../../../stores/useUserStore';
import logo from '../../../assets/logo.png';

interface Position {
  posName: string;
  posCode: number;
  posNowNumber: number;
  posNumber: number;
  members: string[];
}
interface MemberData {
  jobCode: {
    id: number; // Or string, based on your actual data model
  };
  member: {
    nickname: string;
  };
}

const IndexPage = () => {
  useRequireAuth();
  const { profile } = useUserStore();
  const memberId = profile?.id;
  console.log(memberId);
  //인덱스 페이지에서 세팅 페이지로 이동
  const navigate = useNavigate();
  const [isProjectStarted, setIsProjectStarted] = useState(false);
  const [startDay, setStartDay] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [img, setImg] = useState('');
  const [mystack, setMyStack] = useState<string[]>([]);
  const [period, setPeriod] = useState<number>(0);
  const [positions, setPositions] = useState<Position[]>([]);
  const { projectId } = useParams();

  const MemberSetting = () => {
    navigate('./membersetting');
    window.scrollTo({ top: 0 });
  };

  const Setting = () => {
    navigate('./setting');
    window.scrollTo({ top: 0 });
  };

  const startProject = async () => {
    try {
      await axiosInstance.patch(`/projects/${projectId}/start/${memberId}`);
      getData(); // Refresh data after starting the project
    } catch (error) {
      console.error('Start failed:', error);
    }
  };

  const endProject = async () => {
    try {
      await axiosInstance.patch(`/projects/${projectId}/end/${memberId}`);
      getData(); // Refresh data after ending the project
    } catch (error) {
      console.error('End failed:', error);
    }
  };

  const calculatePeriod = () => {
    if (!startDay) return '0 일';

    const startDate = new Date(startDay);
    const currentDate = new Date();
    const differenceInTime = currentDate.getTime() - startDate.getTime(); // Correctly typed as number - number
    const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24));

    return `${differenceInDays} 일`;
  };

  const getData = async () => {
    try {
      const response = await axiosInstance.get(`/projects/${projectId}/${memberId}`);
      const data = response.data.data;
      setTitle(data.title);
      setDescription(data.content);
      setImg(data.projectImgUrl);
      setMyStack(data.techCodes.map((tech: { detailName: any }) => tech.detailName));
      setPeriod(data.period);
      setIsProjectStarted(data.startDay !== null);
      setStartDay(data.startDay);

      const updatedPositions = data.projectTotals.map(
        (item: { jobCode: { detailDescription: any; id: any }; current: any; total: any }) => ({
          posName: item.jobCode.detailDescription,
          posCode: item.jobCode.id, // Ensure this is correctly populated
          posNowNumber: item.current,
          posNumber: item.total,
          members: [],
        }),
      );

      const membersResponse = await axiosInstance.get(`/projects/${projectId}/members`);
      const membersData = membersResponse.data.data;
      console.log(membersData);
      membersData.forEach((memberData: MemberData) => {
        console.log('Looking for position with posCode:', memberData.jobCode.id);
        const position = updatedPositions.find((pos: { posCode: any }) => pos.posCode === memberData.jobCode.id);
        if (position) {
          position.members.push(memberData.member.nickname);
        } else {
          console.log('No matching position found for jobCode.id:', memberData.jobCode.id);
        }
      });

      setPositions(updatedPositions);
    } catch (error) {
      console.error('Loading failed:', error);
    }
  };

  useEffect(() => {
    getData();
  }, [projectId]);

  return (
    <div className='w-full h-auto p-4 '>
      <div className='rounded-2xl shadow-2xl flex h-11/12 p-2'>


        <div className='w-6/12'>

          <div className='p-2 h-20 mb-7'>
            <div className='text-2xl'>제목</div>
            <hr className='border-main-color border-1 w-1/6 my-1' />
            <div className='text-3xl font-bold overflow-y-scroll h-16 '>{title}</div>
          </div>


          <div className='h-44 p-2 mb-7'>
            <div className='text-2xl'>설명</div>
            <hr className='border-main-color border-1 w-1/6 my-1' />
            <div className='font-bold overflow-y-scroll h-40'>
              {description.split('\n').map((line, index) => (
                <React.Fragment key={index}>
                  {line}
                  <br />
                </React.Fragment>
              ))}
            </div>
          </div>

          <div className=' h-20 p-2 mb-7'>
            <div className='text-2xl'>기술스택</div>
            <hr className='border-main-color border-1 w-2/6 my-1' />
            <div className='flex flex-wrap'>
              {mystack.map((tech, index) => (
                <div key={index} className='bg-sub-color p-1 m-1 rounded-full'>
                  {tech}
                </div>
              ))}
            </div>
          </div>

          <div className='h-40 p-2'>
            <div className='flex'>
              <span className='text-2xl'>구성인원</span>
            </div>
            <hr className='border-main-color border-1 w-2/6 my-1' />
            <div className='overflow-y-auto h-28'>
              {positions.map((position, index) => (
                <div key={index} className='h-8'>
                  {`${position.posName}: ${position.posNumber}명 `}
                  {position.members.map((nickname, memberIndex) => (
                    <span key={memberIndex} className='bg-sub-color p-1 m-1 rounded-full'>
                      {nickname}
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>


        </div>

        <div className='border-r-2 border-main-color'></div>

        <div className='w-6/12'>
          <div className='h-72 p-2 mb-5'>
            <div className='text-2xl'>사진</div>
            <hr className='m-1 border-main-color border-1 w-1/6' />
            <div className=' flex justify-center'>
              <img src={img || logo} className='w-auto h-64' />
            </div>
          </div>


          <div className='flex justify-center mb-5'>
            <div className='h-24 p-2 mr-10'>
              <div className='text-2xl'>예상 기간</div>
              <hr className='m-1 border-main-color border-1' />
              <div className='text-center text-3xl'>{period === 0 ? '미정' : `${period} 주`}</div>
            </div>


            <div className='h-24 p-2'>
              <div className='text-2xl'>진행 기간</div>
              <hr className='m-1 border-main-color border-1' />
              <div className='text-center text-3xl'>
                {isProjectStarted ? (
                  calculatePeriod()
                ) : '시작 전'}
              </div>
            </div>
          </div>

          <div className='h-40 p-2'>
            <div className='text-2xl'>프로젝트 설정</div>
            <hr className='m-1 border-main-color border-1 w-3/6' />

            <div className='flex justify-center text-center'>
              <div>
                <div>
                  시작/종료
                </div>
                <div>
                  {isProjectStarted ? (
                    <button className='ml-1 mb-2 bg-main-color text-white p-1 rounded' onClick={endProject}>
                      프로젝트 종료
                    </button>
                  ) : (
                    <button className='ml-1 mb-2 bg-main-color text-white p-1 rounded' onClick={startProject}>
                      프로젝트 시작
                    </button>
                  )}
                </div>

              </div>
              <div className='mx-7'>
                <div>
                  멤버 설정
                </div>
                <div>

                  <FaCircleUser className='text-2xl ml-3 mt-1 cursor-pointer' onClick={MemberSetting} />
                </div>
              </div>
              <div>
                <div>
                프로젝트 수정
                </div>
                <div>
                <FaGear className='mt-1 text-2xl cursor-pointer' onClick={Setting} />
                </div>
                </div>

            </div>


          </div>

        </div>


      </div>
    </div>
  );
};

export default IndexPage;
