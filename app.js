const canvas = document.getElementById("jsCanvas");
const ctx = canvas.getContext("2d");
const colors = document.getElementsByClassName("jsColor");
const range = document.getElementById("jsRange");
const mode = document.getElementById("jsMode");
const saveBtn = document.getElementById("jsSave");
const eraser = document.getElementById("jsEraser");

const INITIAL_COLOR = "#2c2c2c";
const CANVAS_SIZE = 700;

canvas.width = CANVAS_SIZE;
canvas.height = CANVAS_SIZE;

// background default
// 설정하지 않으면 배경색이 투명이라 이미지 저장 시 투명 이미지로 저장됨
ctx.fillStyle = "white";
ctx.fillRect(0, 0, canvas.width, canvas.height);

ctx.strokeStyle = INITIAL_COLOR; // pen의 dafault color
ctx.fillStyle = INITIAL_COLOR; //fill default color
ctx.lineWidth = 2.5; // pen의 dafault lineWidth

let painting = false;
let filling = false;
let erasing = false;

function onMouseMove(event) {
  // canvas 내에서 마우스 위치 가져오기
  const x = event.offsetX;
  const y = event.offsetY;
  if (!painting) {
    // x, y의 좌표에 따라 path 생성
    ctx.beginPath();
    ctx.moveTo(x, y);
  } else if (erasing) {
    //사각형 모양으로 지우기
    ctx.clearRect(x, y, ctx.lineWidth * 5, ctx.lineWidth * 5);
  } else {
    // x, y의 좌표에 따라 line 그리기
    ctx.lineTo(x, y);
    ctx.stroke();
  }
}

function onMouseEnter(event) {
  const x = event.offsetX;
  const y = event.offsetY;
  ctx.moveTo(x, y);
}

function stopPainting() {
  painting = false;
}

function startPainting() {
  if (!filling || erasing) {
    painting = true;
  }
}

function handleColorClick(event) {
  const color = event.target.style.backgroundColor;
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
}

function handleRangeChange(event) {
  const size = event.target.value;
  ctx.lineWidth = size;
}

function handleModeClick() {
  if (filling === true) {
    filling = false;
    mode.innerText = "Fill";
  } else {
    filling = true;
    mode.innerText = "Paint";
  }
}

function handleCanvasClick() {
  if (filling && !erasing) {
    // filling 모드이면서 erase 모드가 아닐 때만 코드 수행
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
}

function handleCM(event) {
  // 우클릭 방지 함수
  event.preventDefault();
}

function handleSaveClick() {
  const image = canvas.toDataURL();
  const link = document.createElement("a");
  link.href = image; // href에는 image(URL)이 들어가야 한다.
  link.download = "PaintJS[EXPORT]"; // download에는 다운로드되는 이미지의 name을 지정한다.
  link.click();
}

function handleEraseClick() {
  if (erasing === true) {
    erasing = false;
    mode.disabled = false;
  } else {
    erasing = true;
    mode.disabled = true;
  }
  eraser.classList.toggle("erasing");
}

if (canvas) {
  canvas.addEventListener("mousemove", onMouseMove);
  canvas.addEventListener("mousedown", startPainting);
  canvas.addEventListener("mouseup", stopPainting);
  canvas.addEventListener("mouseenter", onMouseEnter);
  canvas.addEventListener("click", handleCanvasClick);
  canvas.addEventListener("contextmenu", handleCM);
}

// 선택한 object의 style을 반환하여 array로 변환
Array.from(colors).forEach((color) =>
  color.addEventListener("click", handleColorClick)
);

if (range) {
  range.addEventListener("input", handleRangeChange);
}
if (mode) {
  mode.addEventListener("click", handleModeClick);
}

if (saveBtn) {
  saveBtn.addEventListener("click", handleSaveClick);
}

if (eraser) {
  eraser.addEventListener("click", handleEraseClick);
}
