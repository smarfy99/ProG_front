import React,{useEffect,useState} from 'react';
import { FaGear } from "react-icons/fa6";
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { axiosInstance } from '../../../apis/lib/axios';

const nowperiod = "12일"

const memberId=1;

const IndexPage = () => {
  //인덱스 페이지에서 세팅 페이지로 이동
  const navigate = useNavigate();
  const MemberSetting = () => {
    navigate('./membersetting');
    window.scrollTo({ top: 0 });
  };
  const Setting = () => {
    navigate('./setting');
    window.scrollTo({ top: 0 });
  };

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
      <div className='flex justify-between'>
        <div className=' w-full h-screen flex p-10 flex-col'>
          <div>
            <div className='flex justify-between'>
              <span />
              <span className='flex'>
                <span className=' font-bold cursor-pointer' onClick={Setting}>
                  프로젝트 설정
                </span>
                <span className='mt-1 cursor-pointer' onClick={Setting}>
                  <FaGear />
                </span>
              </span>
            </div>
            <div className='flex h-100 bg-gray-100'>
              <div className='w-7/12'>

                <div className='border-black border-2 h-20 p-2'>
                  <div className='text-2xl'>
                    제목
                  </div>
                  <div className='text-3xl font-bold'>
                    {title}
                  </div>
                </div>
                <div className='border-black border-2 h-52 p-2'>
                  <div className='text-2xl'>
                    설명
                  </div>
                  <div className='font-bold'>
                    {description.split('\n').map((line, index) => (
                      <React.Fragment key={index}>
                        {line}
                        <br />
                      </React.Fragment>
                    ))}
                  </div>
                </div>
                <div className='border-black border-2 h-24 p-2'>
                  <div className='text-2xl'>
                    기술스택
                  </div>
                  <div className="flex flex-wrap">
                    {mystack.map((tech, index) => (
                      <div key={index} className="bg-gray-200 p-1 m-1 rounded-full">
                        {tech}
                      </div>
                    ))}
                  </div>
                </div>

              </div>
              <div className='w-5/12'>

                <div className='border-black border-2 h-48 p-2'>
                  <div className='text-2xl'>
                    사진
                  </div>
                  <img src={img} className='w-full h-36' />
                </div>
                <div className='border-black border-2 h-24 p-2'>
                  <div className='text-2xl'>
                    예상 진행기간
                  </div>
                  <div className='text-center text-3xl'>
                    {period} 주
                  </div>
                </div>
                <div className='border-black border-2 h-24 p-2'>
                  <div className='text-2xl'>
                    현재 진행기간
                  </div>
                  <div className='text-center text-3xl'>
                    {nowperiod}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='border-black border-2 h-40 bg-gray-100 p-2'>
            <div className='flex'>
              <span className='text-2xl'>
                구성인원
              </span>
              <span className='text-2xl ml-3 mt-1 cursor-pointer' onClick={MemberSetting} >
                <FaGear />
              </span>
            </div>


            <div className='overflow-y-auto h-28'>
              {positions.posName.map((name, index) => (
                <div key={index} className='h-8'>
                  {`${name}: ${positions.posNumber[index]}명`}
                </div>
              ))}
            </div>
          </div>


        </div>
      </div>
    </div>
  );
};


export default IndexPage;
