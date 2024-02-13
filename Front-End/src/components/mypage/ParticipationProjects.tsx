import {useEffect, useState} from "react";
import '../../styles/my-project-card.scss';
import {LineProgressBar} from '@frogress/line'
import {Link} from "react-router-dom";

/**
 * 필요정보
 * 프로젝트ID
 * 프로젝트 제목
 * 프로젝트 시작일
 * 프로젝트 종료일
 * 프로젝트 이미지 주소
 *  https://t1.daumcdn.net/thumb/R720x0.fjpg/?fname=http://t1.daumcdn.net/brunch/service/user/5dXQ/image/fozCucJjp0u3RvWPLxWWf6NVbSI
 * 프로젝트 참여 인원수
 * 프로젝트 상태코드
 * 프로젝트 진행도 => 종료일 - 오늘 날짜 ... 프로그레스바 라이브러리 찾기
 *
 */
interface ProjectItem {
    id: number;
    title: string;
    startDay: string;
    endDay: string;
    projectImgUrl: string;
    participants: number;
    statusCode: {
        detailDescription: string;
    };
    progress: number;
}

const tempData: ProjectItem[] = [
    {
        id: 1,
        title: "프로젝트1",
        startDay: "2024-02-13",
        endDay: "2024-05-20",
        projectImgUrl: "https://t1.daumcdn.net/thumb/R720x0.fjpg/?fname=http://t1.daumcdn.net/brunch/service/user/5dXQ/image/fozCucJjp0u3RvWPLxWWf6NVbSI",
        participants: 5,
        statusCode: {detailDescription: "모집중"},
        progress: 30
    },
    {
        id: 2,
        title: "프로젝트2",
        startDay: "2024-02-13",
        endDay: "2024-05-20",
        projectImgUrl: "https://r1.community.samsung.com/t5/image/serverpage/image-id/5488087i93A805462EA2A36A/image-size/large?v=v2&px=999",
        participants: 5,
        statusCode: {detailDescription: "모집중"},
        progress: 40
    },
    {
        id: 3,
        title: "프로젝트3",
        startDay: "2024-02-13",
        endDay: "2024-05-20",
        projectImgUrl: "https://t4.daumcdn.net/thumb/R720x0/?fname=http://t1.daumcdn.net/brunch/service/user/5dXQ/image/AHC4EXtiLGXd9kqlR1JfBmRsBj8.jpg",
        participants: 5,
        statusCode: {detailDescription: "모집중"},
        progress: 50
    },
    {
        id: 4,
        title: "프로젝트4",
        startDay: "2024-02-13",
        endDay: "2024-05-20",
        projectImgUrl: "https://cdn.3hoursahead.com/v2/content/image-comp/bbad7bb4-42cd-4922-8c25-26dbb0a90aa5.webp",
        participants: 5,
        statusCode: {detailDescription: "모집중"},
        progress: 60
    },
    {
        id: 5,
        title: "프로젝트5",
        startDay: "2024-02-13",
        endDay: "2024-05-20",
        projectImgUrl: "https://file.newswire.co.kr/data/datafile2/thumb_480/2007/03/2007032311746173120.45463400.jpg",
        participants: 5,
        statusCode: {detailDescription: "모집중"},
        progress: 100
    }
]

const CustomLabelComponent = ({percent}: { percent: number }) => {
    return (
        <div className="custom-label">
            <span>{percent}%</span>
        </div>
    );
}

// const ProjectNav

const ParticipationProjects = () => {
    const [myProjectList, setMyProjectList] = useState<ProjectItem[]>([]); // 내가 참여중인 프로젝트 리스트

    useEffect(() => {
        console.log(`useEffect`)
        setMyProjectList(tempData);
    }, []);

    return (
        // <section className={'flex justify-between flex-wrap'}>
        <section>
            {/*{projectList.map((project, index) => (*/}
            {myProjectList.map((data, index) => (
                <article key={index} className={'project-link'}>
                    {/*TODO : 상세로 이동*/}
                    <Link to={''} >
                        {/*이미지 영역*/}
                        <div className={'img-box flex justify-center'}>
                            <img src={`${data.projectImgUrl}`} alt="이미지없음"/>
                        </div>
                        {/*컨텐츠 영역*/}
                        <div className={'p-3 project-content'}>
                            {/*제목*/}
                            <div>
                                <h1 className={'truncate text-2xl text-cyan-700 font-bold'}>{data.title}</h1>
                            </div>
                            {/*프로젝트진행일*/}
                            {/*프로젝트상태 & N명 참여중*/}
                            <div className={'text-gray-500 text-sm'}>
                                <p>📆 {data.startDay} ~ {data.endDay}</p>
                            </div>
                            <div>
                                <p className={'text-gray-500 text-sm'}> 👩‍💻 {data.participants}명 참여중</p>
                            </div>
                            {/*프로그레스바*/}
                            <div>
                                <LineProgressBar
                                    label={(value: number) => <CustomLabelComponent percent={value}/>}
                                    percent={data.progress}
                                    progressColor="linear-gradient(to right, rgb(18, 216, 250) 25%, rgb(67, 164, 255) 85%, rgb(49, 121, 255) 98%)"
                                    containerColor="#e9ecef"
                                    height={20}
                                />
                            </div>
                        </div>
                    </Link>
                </article>
            ))}
        </section>
    );

}
export default ParticipationProjects;