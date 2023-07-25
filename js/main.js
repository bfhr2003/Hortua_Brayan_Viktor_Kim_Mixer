console.log("JS file connected");

// Variables
const theButtons = document.querySelectorAll("#buttonControls img"),
    blockBar = document.querySelector(".sound-board"),
    musicalToolsDiv = document.querySelector(".musical-tools"),
    dropZones = document.querySelectorAll(".drop-zone"),
    playBtn = document.getElementById("play-btn"),
    stopBtn = document.getElementById("stop-btn"),
    musicalTools = document.querySelectorAll(".musical-tools div");

let draggedPiece;
let droppedPiece = false;
let currentDroppedPiece = null;
let droppedPieces = [];

//functions
function handleDragOver(e) {
  e.preventDefault();
  console.log("Dragged over me");
}

function handleStartDrag() {
  console.log("Started dragging this piece:", this);
  draggedPiece = this;
}

function handleDrop(e) {
  e.preventDefault();
  console.log("Dropped something on me");

  if (this.classList.contains("drop-zone")) {
    if (this.children.length >= 1) {
      return;
    }

    this.appendChild(draggedPiece);
    droppedPiece = true;

    const audioPlayer = this.querySelector('audio');
    if (audioPlayer && typeof audioPlayer.play === 'function') {
      audioPlayer.currentTime = 0;
      audioPlayer.play();
      playBtn.disabled = false; // Enable the play button once a piece is dropped

      // Add the dropped piece to the array if it's not already there
      if (!droppedPieces.includes(draggedPiece)) {
        droppedPieces.push(draggedPiece);
      }
    } else {
      console.error('Audio player not found or does not have a play method.');
    }
  }
}

//Delete Zone
function handleDeleteDragOver(e) {
  e.preventDefault();
  console.log("Dragged over delete-zone");
}

function handleDeleteDrop(e) {
  e.preventDefault();
  console.log("Dropped on delete-zone");

  if (draggedPiece) {
    if (draggedPiece.parentNode === blockBar) {
      // Si la pieza se arrastra desde la "sound-board"
      draggedPiece.parentNode.removeChild(draggedPiece);
      musicalToolsDiv.appendChild(draggedPiece);
    } else if (draggedPiece.parentNode.classList.contains("drop-zone")) {
      // Si la pieza se arrastra desde una "drop-zone"
      draggedPiece.parentNode.removeChild(draggedPiece);
      musicalToolsDiv.appendChild(draggedPiece);
    }

    const audioPlayer = draggedPiece.querySelector('audio');
    if (audioPlayer && typeof audioPlayer.pause === 'function') {
      audioPlayer.pause();
      audioPlayer.currentTime = 0;
    }

    draggedPiece.classList.remove("dragged");

    // Remove the dragged piece from the droppedPieces array
    const index = droppedPieces.indexOf(draggedPiece);
    if (index !== -1) {
      droppedPieces.splice(index, 1);
    }
  }
}

//reset button
function resetMusicalTool() {
  pauseAllAudio();

  droppedPieces.forEach((piece) => {
    piece.classList.remove("dropped");
    if (piece.parentNode) {
      piece.parentNode.removeChild(piece);
      musicalToolsDiv.appendChild(piece);
    }
  });

  // Clear the droppedPieces array
  droppedPieces = [];
}

//play button
function playAllAudio() {
  if (droppedPieces.length === 0) {
    window.alert('No piece dropped in the drop zone. Cannot play audio.');
  } else {
    droppedPieces.forEach((piece) => {
      const audioPlayer = piece.querySelector('audio');
      if (audioPlayer && typeof audioPlayer.play === 'function') {
        audioPlayer.play();
      } else {
        console.error('Audio player not found or does not have a play method.');
      }
    });
  }
}


// stop button
function pauseAllAudio() {
  let foundAudioPlayer = false;

  dropZones.forEach((zone) => {
    const audioPlayer = zone.querySelector('audio');

    if (audioPlayer) {
      if (typeof audioPlayer.pause === 'function') {
        audioPlayer.pause();
        foundAudioPlayer = true;
      }
    }
  });

  if (!foundAudioPlayer) {
    console.warn('No se encontró ningún reproductor de audio en las zonas de descenso.');
  }
}


// Event Listeners
musicalTools.forEach((piece) => piece.addEventListener("dragstart", handleStartDrag));
dropZones.forEach((zone) => {
  zone.addEventListener("dragover", handleDragOver);
  zone.addEventListener("drop", handleDrop);
});
document.getElementById("delete-zone").addEventListener("dragover", handleDeleteDragOver)
document.getElementById("delete-zone").addEventListener("drop", handleDeleteDrop);

playBtn.addEventListener("click", playAllAudio);
stopBtn.addEventListener("click", pauseAllAudio);

// Reset button event listener
const resetButton = document.getElementById("resetBtn");
resetButton.addEventListener("click", resetMusicalTool);