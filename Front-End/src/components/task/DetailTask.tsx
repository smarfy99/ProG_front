import React, { useState } from "react";
import {
  FaAnglesRight,
  FaRegCircleUser,
  FaClockRotateLeft,
} from "react-icons/fa6";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // ReactQuill 스타일시트 임포트

interface ChecklistItem {
  id: number;
  text: string;
  isChecked: boolean;
}

const DetailTask = () => {
  const [editorContent, setEditorContent] = useState("");
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
  const [newItemText, setNewItemText] = useState("");
  const [isOpen, setIsOpen] = useState(true);

  const editorChange = (content: string) => {
    setEditorContent(content);
  };

  const handleChecklistChange = (id: number) => {
    setChecklist(
      checklist.map(
        (
          item // 현재 배열의 상태를 순회함.
        ) => (item.id === id ? { ...item, isChecked: !item.isChecked } : item) // 만약 배열에 일치하는 id가 있으면, 상태를 반대로 바꿈
      )
    );
  };

  const addChecklistItem = () => {
    setChecklist([
      ...checklist,
      { id: Date.now(), text: newItemText, isChecked: false }, // 새 체크리스트가 만들어지면, 이전의 체크리스트 배열에 추가.
    ]);
    setNewItemText(""); // 새 chklist를 입력할 수 있도록 아이템을 비워놓음.
  };

  const handleClose = () => {
    setIsOpen((prev) => !prev);
  };

  if (!isOpen) return null;

  const calculateProgress = () => {
    const totalItems = checklist.length;
    const completedItems = checklist.filter((item) => item.isChecked).length;
    return totalItems > 0 ? (completedItems / totalItems) * 100 : 0;
  };

  const progressPercentage = calculateProgress();

  const removeChecklistItem = (id: number) => {
    setChecklist(checklist.filter((item) => item.id !== id));
  };

  return (
    <div className="bg-slate-50 p-4 rounded-md shadow-lg">
      <div className="flex items-center mb-4">
        <FaAnglesRight
          onClick={handleClose}
          className="text-lg text-gray-600 mr-2"
        />
        <h1 className="text-xl font-bold">상세 업무 등록</h1>
        <button className="absolute top-4 right-4 bg-blue-500 text-white p-2 rounded">
          업무 등록
        </button>
      </div>

      <div className="flex items-center mb-4">
        <FaRegCircleUser className="text-gray-600 mr-2" />
        <p className="text-md">사용자: [이름]</p>
        <p className="text-md ml-4">업무 등록 시작일: [날짜]</p>
      </div>
      <p className="font-semibold mb-2">업무 제목</p>
      <input
        type="text"
        className="border border-gray-300 rounded p-2 mr-2 w-96"
      />
      <hr />

      <div className="my-4 flex items-center">
        <FaClockRotateLeft className="text-gray-600 mr-2" />
        {/* 상태코드 변경 로직 */}
      </div>

      <div className="mb-4">
        <FaRegCircleUser className="text-gray-600 mr-2" />
        {/* 담당자 변경 로직 */}
      </div>

      <div className="flex flex-col">
        <div className="mb-4">
          <ReactQuill
            className="h-40"
            theme="snow"
            value={editorContent}
            onChange={editorChange}
          />
        </div>
        <p className="mt-20">Progressive Bar</p>
        <div className="flex items-center mb-4">
          {/* 프로그레시브 바 */}
          <div className="w-full bg-gray-200 rounded h-4">
            <div
              className="bg-main-color h-4 rounded"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>

          {/* 진행률 표시 */}
          <span className="ml-2">{progressPercentage.toFixed(0)}%</span>
        </div>
      </div>
      <div className="mb-4">
        <h2 className="font-semibold mb-2">하위업무</h2>
        <ul className="list-disc pl-6">
          {checklist.map((item) => (
            <li key={item.id} className="flex items-center mb-2">
              <input
                type="checkbox"
                checked={item.isChecked}
                onChange={() => handleChecklistChange(item.id)}
              />
              <span className={item.isChecked ? "line-through" : ""}>
                {item.text}
              </span>

              <button
                className="ml-2 text-red-500"
                onClick={() => removeChecklistItem(item.id)}
              >
                X
              </button>
            </li>
          ))}
        </ul>

        <div className="flex mt-2">
          <input
            type="text"
            className="border border-gray-300 rounded p-2 mr-2 w-96"
            value={newItemText}
            onChange={(e) => setNewItemText(e.target.value)}
          />
          <button
            className="bg-blue-500 text-white p-2 rounded"
            onClick={addChecklistItem}
          >
            추가
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetailTask;
