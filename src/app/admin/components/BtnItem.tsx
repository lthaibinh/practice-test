export const BtnItem = () => {
  return (
    <div id="button" className="flex flex-col items-center  cursor-grab" draggable onDragStart={(e) => {
        let element = e.target as HTMLElement;
        e.dataTransfer.setData("componentName", 'button');
      }}>
      <div className="w-10 h-10 border-2 border-solid border-black"></div>
      <div>Button</div>
    </div>
  );
};
