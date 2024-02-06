import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Comment from '../../components/comment/Comment';
import { axiosInstance } from '../../apis/lib/axios';

const memberId = 1;


const RecruitProjectPage = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [img, setImg] = useState('');
  const [mystack, setMyStack] = useState<string[]>([]);
  const [period, setPeriod] = useState('');
  const [positions, setPositions] = useState({
    posName: [],
    posCode: [],
    posNowNumber: [],
    posNumber: [],
  });
  const [MyProject, setMyProject] = useState(true);

  const { projectId } = useParams();

  const getData = async () => {
    try {
      const response = await axiosInstance.get(`/projects/${projectId}/${memberId}`, {
      });
      const data = response.data.data;

      console.log(data.projectTotals)
      setTitle(data.title);
      setDescription(data.content);
      setImg(data.projectImgUrl);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const mystack = data.techCodes.map((tech: { detailName: any; }) => tech.detailName);
      setMyStack(mystack);
      setPeriod(data.period);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const currentArray = data.projectTotals.map((item: { current: any; }) => item.current);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const totalArray = data.projectTotals.map((item: { total: any; }) => item.total);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const jobIdArray = data.projectTotals.map((item: { jobCode: { id: any; }; }) => item.jobCode.id);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const jobDescriptionArray = data.projectTotals.map((item: { jobCode: { detailDescription: any; }; }) => item.jobCode.detailDescription);
      setPositions({
        posName: jobDescriptionArray,
        posCode: jobIdArray,
        posNowNumber: currentArray,
        posNumber: totalArray,
      })

      // setPositions(data.projectTotals)
      setMyProject(data.isMember);

    } catch (error) {
      console.error("Loading failed:", error);
    }
  };
  useEffect(() => {
    getData();
    console.log(projectId)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  return (
    <div>
      <div className='flex items-center justify-center'>
        <div className='w-10/12 h-screen flex p-10 flex-col'>
          <Link to='../recruit'>목록으로 돌아가기</Link>
          <div>
            <div></div>
            <div className='flex h-100 bg-gray-100'>
              <div className='w-7/12'>
                <div className='border-black border-2 h-20 p-2'>
                  <div className='text-2xl'>제목</div>
                  <div className='text-3xl font-bold'>{title}</div>
                </div>
                <div className='border-black border-2 h-52 p-2'>
                  <div className='text-2xl'>설명</div>
                  <div className='font-bold'>
                    {description.split('\n').map((line, index) => (
                      <React.Fragment key={index}>
                        {line}
                        <br />
                      </React.Fragment>
                    ))}
                  </div>
                </div>
                <div className='border-black border-2 h-40 p-2'>
                  <div className='text-2xl'>기술스택</div>
                  <div className='flex flex-wrap'>
                    {mystack.map((tech, index) => (
                      <div key={index} className='bg-gray-200 p-1 m-1 rounded-full'>
                        {tech}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className='w-5/12'>
                <div className='border-black border-2 h-48 p-2'>
                  <div className='text-2xl'>사진</div>
                  <img src={img} className='w-full h-36' alt='Project' />
                </div>
                <div className='border-black border-2 h-24 p-2'>
                  <div className='text-2xl'>예상 진행기간</div>
                  <div className='text-center text-3xl'>{period} 주</div>
                </div>
                <div className='border-black border-2 h-40 bg-gray-100 p-2 flex-col '>
                  {MyProject ? (
                    <div className='flex flex-col'>
                      <div className='text-2xl h-8'>링크</div>
                      <div className='flex items-center justify-center'>
                        <Link
                          to={`/project/${projectId}`}
                          className=' bg-main-color text-white p-2 rounded font-bold text-3xl m-5 w-max text-center'
                        >
                          프로젝트로 이동하기
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className='text-2xl h-8'>구성인원</div>
                      <div className='overflow-y-scroll max-h-28 flex flex-col items-center justify-start'>
                        {positions.posName.map((name, index) => (
                          <div key={index} className='h-8 m-1'>
                            {`${name}: ${positions.posNowNumber[index]} / ${positions.posNumber[index]}명`}
                            {positions.posNowNumber[index] < positions.posNumber[index] ? (
                              <button className='ml-3 bg-main-color text-white p-1 rounded'>지원하기</button>
                            ) : (
                              <button className='ml-3 bg-orange-500 text-black p-1 rounded' disabled>
                                모집완료
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className='border-black border-2 h-auto bg-gray-100 p-2'>
            <div className='text-2xl'>댓글</div>
            <Comment />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecruitProjectPage;
