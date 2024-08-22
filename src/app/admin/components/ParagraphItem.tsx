export const ParagraphItem = () => {
    return (
      <div id="ParagrahpItem" className="flex flex-col items-center  cursor-grab" draggable onDragStart={(e) => {
          let element = e.target as HTMLElement;
          e.dataTransfer.setData("componentName", 'paragraph');
        }}>
        <div className="w-10 h-10 border-2 border-solid border-black"></div>
        <div>paragraph</div>
      </div>
    );
  };
  