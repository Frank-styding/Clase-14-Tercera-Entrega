function createBoard(matrixData = new Array(16).fill("")) {
  let $board = $("#board");
  let matrixCelds = [];
  $board.empty();
  for (let item of matrixData) {
    let container = $(`<div class="celd-container"></div>`);
    let celd = $(`<div class="celd val-${item}">${item}</div>`);
    container.append(celd);
    $board.append(container);
    matrixCelds.push(celd);
  }
  return { matrixCelds, matrixData };
}
function setMatrixDataToMatrixCelds(matrixData, matrixCelds) {
  matrixCelds.forEach((celd, idx) => {
    celd
      .attr("class", "")
      .addClass("celd")
      .addClass(`val-${matrixData[idx]}`)
      .html(matrixData[idx]);
  });
}
function GenerateRandomValues(matrixData, matrixCelds) {
  if (!matrixData.some((item) => item == "")) return;
  let list = matrixData
    .map((item, idx) => ({
      item,
      idx,
    }))
    .filter((item) => item.item == "")
    .map((item) => item.idx);

  let idx = list[Math.round(Math.random() * (list.length - 1))];

  matrixData[idx] = "2";
  matrixCelds[idx].html("2").addClass("val-2");
  addAnimationNew(matrixCelds[idx]);
}
function moveMatrix(matrixData, direction = { x: 0, y: 0 }) {
  let _matrixData = new Array(matrixData.length).fill("");

  let OperateData = (data, reverse = false) => {
    let result = [];

    let _data = data.slice();

    if (reverse) {
      _data.reverse();
    }

    for (let i = 0; i < _data.length; i++) {
      if (i + 1 < data.length) {
        if (_data[i] == _data[i + 1] && _data[i] != "") {
          result.push("" + parseInt(_data[i]) * 2);
          score += 10;
          i++;
        } else {
          result.push(_data[i]);
        }
      } else {
        result.push(_data[i]);
      }
    }

    if (reverse) {
      result.reverse();
    }

    return result;
  };

  let FilterOperateData = (condition, reverse) => {
    return OperateData(
      matrixData.filter((item, idx) => item != "" && condition(idx)),
      reverse
    );
  };

  for (let i = 0; i < 4; i++) {
    if (direction.x != 0) {
      FilterOperateData(
        (idx) => Math.floor(idx / 4) == i,
        direction.x == -1
      ).forEach((item, idx, data) => {
        if (direction.x == -1) {
          _matrixData[i * 4 + idx] = item;
        }
        if (direction.x == 1) {
          _matrixData[i * 4 + (4 - data.length) + idx] = item;
        }
      });
    }
    if (direction.y != 0) {
      FilterOperateData((idx) => idx % 4 == i, direction.y == 1).forEach(
        (item, idx, data) => {
          if (direction.y == -1) {
            _matrixData[i + idx * 4] = item;
          }
          if (direction.y == 1) {
            _matrixData[i + (4 - data.length + idx) * 4] = item;
          }
        }
      );
    }
  }

  matrixData.fill("");
  _matrixData.forEach((item, idx) => (matrixData[idx] = item));
}
function addAnimationNew(element) {
  const scale = 0.8;
  const duration = 250;
  element
    .animate(
      {
        width: 110 * scale,
        height: 110 * scale,
      },
      {
        duration: duration / 2,
        easing: "linear",
      }
    )
    .animate(
      {
        width: 110,
        height: 110,
      },
      {
        duration: duration / 2,
        easing: "linear",
      }
    );
}
function clear(matrixCelds, matrixData) {
  matrixData.fill("");
  matrixCelds.forEach((item) => {
    item.html("");
    item.attr("class", "").addClass("celd");
  });
}
function isGameOver(matrixData) {
  if (matrixData.some((item) => item == "")) return false;
  let checkList = (data) => {
    for (let i = 0; i < data.length; i++) {
      if (i + 1 < data.length) {
        if (data[i] == data[i + 1] && data[i] != "") {
          return true;
        }
      }
    }
    return false;
  };

  let result = false;
  for (let i = 0; i < 4; i++) {
    result =
      result ||
      checkList(
        matrixData.filter((item, idx) => Math.floor(idx / 4) == i && item != "")
      ) ||
      checkList(matrixData.filter((item, idx) => idx % 4 == i && item != ""));
  }

  return !result;
}
function updateScore() {
  $("#info").html(score);
}
function showGameOver(matrixData) {
  if (isGameOver(matrixData)) {
    $("#info").html("Game Over");
  }
}

let { matrixCelds, matrixData } = createBoard();
let score = 0;

$(window).on("keydown",(event) => {
  const code = event.keyCode;
  if (code == 38) {
    moveMatrix(matrixData, { x: 0, y: -1 });
    setMatrixDataToMatrixCelds(matrixData, matrixCelds);
    GenerateRandomValues(matrixData, matrixCelds);
    updateScore();
    showGameOver(matrixData);
    //UP
  }
  if (code == 37) {
    moveMatrix(matrixData, { x: -1, y: 0 });
    setMatrixDataToMatrixCelds(matrixData, matrixCelds);
    GenerateRandomValues(matrixData, matrixCelds);
    updateScore();
    showGameOver(matrixData);
    //LEFT
  }
  if (code == 39) {
    moveMatrix(matrixData, { x: 1, y: 0 });
    setMatrixDataToMatrixCelds(matrixData, matrixCelds);
    GenerateRandomValues(matrixData, matrixCelds);
    updateScore();
    showGameOver(matrixData);

    //RIGHT
  }
  if (code == 40) {
    moveMatrix(matrixData, { x: 0, y: 1 });
    setMatrixDataToMatrixCelds(matrixData, matrixCelds);
    GenerateRandomValues(matrixData, matrixCelds);
    updateScore();
    showGameOver(matrixData);

    //DOWN
  }
})

GenerateRandomValues(matrixData, matrixCelds);
GenerateRandomValues(matrixData, matrixCelds);
