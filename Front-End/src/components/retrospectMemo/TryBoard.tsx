import React, { useState } from "react";
import TryDetail from "./TryDetail";

interface Memo {
  retrospectId: number;
  content: string;
}

interface BoardProps {
  memos: Memo[];
}

const TryBoard: React.FC<BoardProps> = ({ memos }) => {
  const [showDetailModal, setShowDetailModal] = useState(false);

  const handleMoreClick = () => {
    setShowDetailModal(true); // 모달 열기
  };

  return (
    <div className="p-6 m-10 max-w-4xl mx-auto bg-white rounded-lg shadow-md border border-gray-100">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Try</h2>
        {memos?.length > 0 && (
          <button
            onClick={handleMoreClick}
            className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-700 transition-colors"
          >
            +보기
          </button>
        )}
      </div>
      <div className="grid grid-cols-2 gap-4">
        {memos?.slice(0, 4).map((memo) => ( // 최대 4개의 메모만 표시
          <div
            key={memo.retrospectId}
            className="bg-green-100 p-4 rounded-lg shadow transform transition-transform duration-200 ease-in-out hover:-translate-y-1 hover:shadow-lg"
          >
            <p className="text-gray-800 text-sm break-words">{memo.content}</p>
          </div>
        ))}
      </div>
      <TryDetail
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        memos={memos}
      />
    </div>
  );
};

export default TryBoard;
