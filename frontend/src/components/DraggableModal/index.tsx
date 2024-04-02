import './styles.css';

import { useEffect } from 'react';

const DraggableModal = ({ children }: { children?: React.ReactNode }) => {
  useEffect(() => {
    const showModalBtn = document.querySelector('.show-modal');
    const bottomSheet = document.querySelector('.bottom-sheet');
    const sheetOverlay = bottomSheet.querySelector('.sheet-overlay');
    const sheetContent = bottomSheet.querySelector('.content');
    const dragIcon = bottomSheet.querySelector('.drag-icon');

    // Global variables for tracking drag events
    let isDragging = false,
      startY,
      startHeight;

    // Show the bottom sheet, hide body vertical scrollbar, and call updateSheetHeight
    const showBottomSheet = () => {
      bottomSheet.classList.add('show');
      document.body.style.overflowY = 'hidden';
      updateSheetHeight(50);
    };

    const updateSheetHeight = (height) => {
      sheetContent.style.height = height + 'vh'; //updates the height of the sheet content
      // Toggles the fullscreen class to bottomSheet if the height is equal to 100
      bottomSheet.classList.toggle('fullscreen', height === 100);
    };

    // Hide the bottom sheet and show body vertical scrollbar
    const hideBottomSheet = () => {
      bottomSheet.classList.remove('show');
      document.body.style.overflowY = 'auto';
    };

    // Sets initial drag position, sheetContent height and add dragging class to the bottom sheet
    const dragStart = (e) => {
      isDragging = true;
      startY = e.pageY || e.touches?.[0].pageY;
      startHeight = parseInt(sheetContent.style.height);
      bottomSheet.classList.add('dragging');
    };

    // Calculates the new height for the sheet content and call the updateSheetHeight function
    const dragging = (e) => {
      if (!isDragging) return;
      const delta = startY - (e.pageY || e.touches?.[0].pageY);
      const newHeight = startHeight + (delta / window.innerHeight) * 100;
      console.log(newHeight, startHeight, delta, window.innerHeight);
      updateSheetHeight(newHeight);
    };

    // Determines whether to hide, set to fullscreen, or set to default
    // height based on the current height of the sheet content
    const dragStop = () => {
      isDragging = false;
      bottomSheet.classList.remove('dragging');
      const sheetHeight = parseInt(sheetContent.style.height);
      sheetHeight < 25 ? hideBottomSheet() : sheetHeight > 75 ? updateSheetHeight(100) : updateSheetHeight(50);
    };

    dragIcon.addEventListener('mousedown', dragStart);
    document.addEventListener('mousemove', dragging);
    document.addEventListener('mouseup', dragStop);

    // dragIcon.addEventListener("touchstart", dragStart);
    // document.addEventListener("touchmove", dragging);
    // document.addEventListener("touchend", dragStop);

    sheetOverlay.addEventListener('click', hideBottomSheet);
    showModalBtn.addEventListener('click', showBottomSheet);
  }, []);
  return (
    <>
      <button class="show-modal">Show Bottom Sheet</button>
      <div class="bottom-sheet">
        <div class="sheet-overlay"></div>
        <div class="content">
          <div class="header">
            <div class="drag-icon">
              <span></span>
            </div>
          </div>
          <div class="body">
            <h2>Bottom Sheet Modal</h2>
            <p>Create a bottom sheet modal that functions similarly to</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default DraggableModal;
