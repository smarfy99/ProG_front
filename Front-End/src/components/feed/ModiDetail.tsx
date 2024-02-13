import {useState, FC, useEffect, useRef} from "react";
import {axiosInstance} from "../../apis/lib/axios.ts";
import ReactQuill from "react-quill";

type ModiDetailProps = {
  boardId: number;
  onClose: () => void;
};

interface Feed {
  memberId: number;
  nickname: string;
  imgUrl: string;
  boardId: number;
  createdAt: string;
  isDeleted: boolean;
  title: string;
  content:string;
  viewCnt: number;
  isNotice: boolean;
}

const ModiDetail: FC<ModiDetailProps> = ({
                                           boardId,
                                           onClose }) => {

  const [feed, setFeed] = useState<Feed>({
    memberId: 0,
    nickname: '',
    imgUrl: '',
    boardId: 0,
    createdAt: '',
    isDeleted: false,
    title: '',
    content:'',
    viewCnt: 0,
    isNotice: false,
  });

  const handleContentChange = (content: string) => {
    setFeed((perv) => ({
      ...perv,
      content: content
    }));
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFeed((perv) => ({
      ...perv,
      title: e.target.value
    }));

    console.log(e.target.value)
  };

  const getFreeFeed = async () => {
    try {
      const response = await axiosInstance.get(`/boards/detail/${boardId}`, {
        headers: {
          'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6MSwiZXhwIjozODUzOTA4NDgwLCJpYXQiOjE3MDY0MjQ4MzMsImF1dGhvcml0aWVzIjpbIlJPTEVfVVNFUiJdfQ.vXlMCRdnAL60yLcAtV70jgpKfYvKBlwSu-NFrCI9LSI'
        },
      });

      const data = response.data.data;
      setFeed(() => ({
        memberId: data.memberId,
        nickname: data.nickname,
        imgUrl: data.imgUrl,
        boardId: data.boardId,
        createdAt: data.createdAt,
        isDeleted: data.isDeleted,
        title: data.title,
        content: data.content,
        viewCnt: data.viewCnt,
        isNotice: data.isNotice,
      }));
      console.log("피드 디테일", data);
    } catch (e) {
      console.error(e);
    }
  }

  useEffect(() => {
    getFreeFeed();
  }, []);

  const updateBoard = async () => {

    const form = new FormData();

    const boardData = {
      title: feed.title,
      content: feed.content,
      isNotice: false
    }

    const jsonData = JSON.stringify(boardData);

    form.set('board', new Blob([jsonData], {type: 'application/json'}));
    // POST 요청 로직
    try {
     const respons =  await axiosInstance.patch(`/boards/detail/${boardId}`, form, {
        headers: {
          'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6MSwiZXhwIjozODUzOTA4NDgwLCJpYXQiOjE3MDY0MjQ4MzMsImF1dGhvcml0aWVzIjpbIlJPTEVfVVNFUiJdfQ.vXlMCRdnAL60yLcAtV70jgpKfYvKBlwSu-NFrCI9LSI'
        },
      })

      console.log(respons);
      onClose();
    }
    catch (e){
      console.error(e);
    }
  };

  const handleSave = () => {
    updateBoard()
  };

  const quillRef = useRef<ReactQuill>(null);

  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      ["link"],
      [{ align: [] }, { color: [] }, { background: [] }],
      ["clean"],
    ],
  };

  return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
        <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
          <div className="mb-4">
            <p className="text-lg font-bold mb-2">제목</p>
            <input
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="제목을 입력하세요"
                value={feed.title}
                onChange={handleTitleChange}
            />
          </div>
          <p className="mb-2">내용</p>
          <div className="mb-20">
            <ReactQuill
                ref={quillRef}
                className="h-80"
                modules={modules}
                value={feed.content}
                onChange={handleContentChange}
            />
          </div>
          <div className="flex justify-end space-x-4 mt-4">
            <button
                className="bg-main-color text-white p-2 rounded hover:bg-blue-700 transition duration-300"
                onClick={handleSave}
            >
              저장
            </button>
            <button
                className="bg-red-500 text-white p-2 rounded hover:bg-red-700 transition duration-300"
                onClick={onClose}
            >
              닫기
            </button>
          </div>
        </div>
      </div>
)
  ;
};

export default ModiDetail;
