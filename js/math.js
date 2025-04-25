let timer;
let timeElapsed = 0;
let exercises = [];
let answers = [];
let timerRunning = false;
let answersShown = false;

// 设置默认日期
window.onload = function () {
  const today = new Date();
  document.getElementById('year').value = today.getFullYear();
  document.getElementById('month').value = String(today.getMonth() + 1).padStart(2, '0');
  document.getElementById('day').value = String(today.getDate()).padStart(2, '0');
  updateDisabledRanges(); // 初始化时更新范围限制显示

  // 设置运算类型的联动
  document.getElementById('add').addEventListener('change', function () {
    const checked = this.checked;
    document.getElementById('add-carry').disabled = !checked;
    document.getElementById('add-no-carry').disabled = !checked;
  });

  document.getElementById('subtract').addEventListener('change', function () {
    const checked = this.checked;
    document.getElementById('subtract-borrow').disabled = !checked;
    document.getElementById('subtract-no-borrow').disabled = !checked;
  });

  document.getElementById('multiply').addEventListener('change', function () {
    const checked = this.checked;
    document.getElementById('multiply-carry').disabled = !checked;
    document.getElementById('multiply-no-carry').disabled = !checked;
  });

  document.getElementById('divide').addEventListener('change', function () {
    const checked = this.checked;
    document.getElementById('divide-exact').disabled = !checked;
  });

  // 初始化禁用状态
  document.getElementById('add-carry').disabled = !document.getElementById('add').checked;
  document.getElementById('add-no-carry').disabled = !document.getElementById('add').checked;
  document.getElementById('subtract-borrow').disabled = !document.getElementById('subtract').checked;
  document.getElementById('subtract-no-borrow').disabled = !document.getElementById('subtract').checked;
  document.getElementById('multiply-carry').disabled = !document.getElementById('multiply').checked;
  document.getElementById('multiply-no-carry').disabled = !document.getElementById('multiply').checked;
  document.getElementById('divide-exact').disabled = !document.getElementById('divide').checked;

  // 设置难度滑块的事件
  document.getElementById('difficultySlider').addEventListener('change', function () {
    setDifficultyPresets(parseInt(this.value));
  });

}

// 根据难度设置预设值
function setDifficultyPresets(level) {
  // 重置所有选项
  document.getElementById('add').checked = false;
  document.getElementById('subtract').checked = false;
  document.getElementById('multiply').checked = false;
  document.getElementById('divide').checked = false;
  document.getElementById('add-carry').checked = false;
  document.getElementById('add-no-carry').checked = false;
  document.getElementById('subtract-borrow').checked = false;
  document.getElementById('subtract-no-borrow').checked = false;
  document.getElementById('multiply-carry').checked = false;
  document.getElementById('multiply-no-carry').checked = false;
  document.getElementById('divide-exact').checked = false;
  //document.getElementById('moveTerms').checked = false;

  // 根据难度级别设置
  switch (level) {
    case 1: // 简单
      document.getElementById('add').checked = true;
      document.getElementById('add-no-carry').checked = true;
      document.getElementById('range1').value = '0-9';
      document.getElementById('range2').value = '0-9';
      document.getElementById('showOp2').checked = false;
      document.getElementById('showOp3').checked = false;
      break;
    case 2: // 较易
      document.getElementById('add').checked = true;
      document.getElementById('subtract').checked = true;
      document.getElementById('add-no-carry').checked = true;
      document.getElementById('subtract-no-borrow').checked = true;
      document.getElementById('range1').value = '2-9';
      document.getElementById('range2').value = '2-9';
      document.getElementById('showOp2').checked = true;
      document.getElementById('showOp3').checked = false;
      break;
    case 3: // 中等
      document.getElementById('add').checked = true;
      document.getElementById('subtract').checked = true;
      document.getElementById('multiply').checked = true;
      document.getElementById('add-carry').checked = true;
      document.getElementById('subtract-borrow').checked = true;
      document.getElementById('multiply-no-carry').checked = true;
      document.getElementById('range1').value = '10-50';
      document.getElementById('range2').value = '10-50';
      document.getElementById('range3').value = '2-9';
      document.getElementById('showOp2').checked = true;
      document.getElementById('showOp3').checked = false;
      break;
    case 4: // 较难
      document.getElementById('add').checked = true;
      document.getElementById('subtract').checked = true;
      document.getElementById('multiply').checked = true;
      document.getElementById('divide').checked = true;
      document.getElementById('add-carry').checked = true;
      document.getElementById('subtract-borrow').checked = true;
      document.getElementById('multiply-carry').checked = true;
      document.getElementById('divide-exact').checked = true;
      document.getElementById('range1').value = '10-50';
      document.getElementById('range2').value = '10-50';
      document.getElementById('range3').value = '2-9';
      document.getElementById('showOp2').checked = true;
      document.getElementById('showOp3').checked = true;
      break;
    case 5: // 困难
      document.getElementById('add').checked = true;
      document.getElementById('subtract').checked = true;
      document.getElementById('multiply').checked = true;
      document.getElementById('divide').checked = true;
      document.getElementById('add-carry').checked = true;
      document.getElementById('subtract-borrow').checked = true;
      document.getElementById('multiply-carry').checked = true;
      document.getElementById('divide-exact').checked = true;
      //document.getElementById('moveTerms').checked = true;
      document.getElementById('range1').value = '51-99';
      document.getElementById('range2').value = '51-99';
      document.getElementById('range3').value = '10-50';
      document.getElementById('range4').value = '2-9';
      document.getElementById('showOp2').checked = true;
      document.getElementById('showOp3').checked = true;
      break;
  }

  // 更新禁用状态
  document.getElementById('add-carry').disabled = !document.getElementById('add').checked;
  document.getElementById('add-no-carry').disabled = !document.getElementById('add').checked;
  document.getElementById('subtract-borrow').disabled = !document.getElementById('subtract').checked;
  document.getElementById('subtract-no-borrow').disabled = !document.getElementById('subtract').checked;
  document.getElementById('multiply-carry').disabled = !document.getElementById('multiply').checked;
  document.getElementById('multiply-no-carry').disabled = !document.getElementById('multiply').checked;
  document.getElementById('divide-exact').disabled = !document.getElementById('divide').checked;
}

// 更新被禁用的数字范围显示
function updateDisabledRanges() {
  const blank = document.getElementById('blank').value;
  const ranges = [
    {id: 'range1', label: document.querySelector('label[for="limit1"]').parentElement},
    {id: 'range2', label: document.querySelector('label[for="limit2"]').parentElement},
    {id: 'range3', label: document.querySelector('label[for="limit3"]').parentElement},
    {id: 'range4', label: document.querySelector('label[for="limit4"]').parentElement}
  ];

  ranges.forEach(range => {
    if (range.id === `range${blank.charAt(1)}` && blank.startsWith('#')) {
      range.label.classList.add('disabled');
    } else {
      range.label.classList.remove('disabled');
    }
  });
}

// 检查是否需要进位（加法）
function requiresCarry(a, b) {
  const aStr = a.toString();
  const bStr = b.toString();

  // 确保两个数字的位数相同，不足的在前面补0
  const maxLength = Math.max(aStr.length, bStr.length);
  const aPadded = aStr.padStart(maxLength, '0');
  const bPadded = bStr.padStart(maxLength, '0');

  let carry = 0;
  for (let i = maxLength - 1; i >= 0; i--) {
    const digitSum = parseInt(aPadded[i]) + parseInt(bPadded[i]) + carry;
    if (digitSum >= 10) {
      return true;
    }
    carry = Math.floor(digitSum / 10);
  }
  return false;
}

// 检查是否需要借位（减法）
function requiresBorrow(a, b) {
  if (a < b) return true; // 如果被减数小于减数，肯定需要借位

  const aStr = a.toString();
  const bStr = b.toString().padStart(aStr.length, '0');

  for (let i = aStr.length - 1; i >= 0; i--) {
    if (parseInt(aStr[i]) < parseInt(bStr[i])) {
      return true;
    }
  }
  return false;
}

// 检查乘法是否需要进位
function multiplyRequiresCarry(a, b) {
  // 对于单位数乘法，检查是否大于等于10
  if (a < 10 && b < 10) {
    return a * b >= 10;
  }

  // 对于多位数乘法，需要检查每一步是否有进位
  const aStr = a.toString();
  const bStr = b.toString();

  for (let i = bStr.length - 1; i >= 0; i--) {
    for (let j = aStr.length - 1; j >= 0; j--) {
      const product = parseInt(aStr[j]) * parseInt(bStr[i]);
      if (product >= 10) {
        return true;
      }
    }
  }

  // 还需要检查部分积相加时是否有进位
  if (a >= 10 && b >= 10) {
    return true; // 多位数乘多位数几乎总是有进位的
  }

  return false;
}

// 计算函数 - 基本运算
function calculate(num1, num2, op) {
  if (op === '+') return num1 + num2;
  if (op === '-') return num1 - num2;
  if (op === '×') return num1 * num2;
  if (op === '÷' && num2 !== 0 && Number.isInteger(num1 / num2)) return num1 / num2;
  return null;
}

// 计算多步骤表达式的结果，考虑运算符优先级
function calculateExpression(nums, ops) {
  // 创建数组的副本，避免修改原始数组
  let numbers = [...nums];
  let operators = [...ops];

  // 先处理乘除法
  for (let i = 0; i < operators.length; i++) {
    if (operators[i] === '×' || operators[i] === '÷') {
      const result = calculate(numbers[i], numbers[i + 1], operators[i]);
      if (result === null) return null;
      numbers[i] = result;
      numbers.splice(i + 1, 1);
      operators.splice(i, 1);
      i--; // 重新检查当前位置
    }
  }

  // 再处理加减法
  for (let i = 0; i < operators.length; i++) {
    if (operators[i] === '+' || operators[i] === '-') {
      const result = calculate(numbers[i], numbers[i + 1], operators[i]);
      if (result === null) return null;
      numbers[i] = result;
      numbers.splice(i + 1, 1);
      operators.splice(i, 1);
      i--; // 重新检查当前位置
    }
  }

  return numbers[0];
}

// 生成习题
function generateExercises() {
  // 清除之前的结果和评价
  resetState();

  const showOp2 = document.getElementById('showOp2').checked;
  const showOp3 = document.getElementById('showOp3').checked;
  const limit1 = document.getElementById('limit1').checked;
  const limit2 = document.getElementById('limit2').checked;
  const limit3 = document.getElementById('limit3').checked;
  const limit4 = document.getElementById('limit4').checked;
  const blank = document.getElementById('blank').value;
 // const moveTerms = document.getElementById('moveTerms').checked;

  // 获取运算类型约束
  const useAdd = document.getElementById('add').checked;
  const useSubtract = document.getElementById('subtract').checked;
  const useMultiply = document.getElementById('multiply').checked;
  const useDivide = document.getElementById('divide').checked;

  const addCarry = document.getElementById('add-carry').checked;
  //const addNoCarry = document.getElementById('add-no-carry').checked;
  const subtractBorrow = document.getElementById('subtract-borrow').checked;
  //const subtractNoBorrow = document.getElementById('subtract-no-borrow').checked;
  const multiplyCarry = document.getElementById('multiply-carry').checked;
  //const multiplyNoCarry = document.getElementById('multiply-no-carry').checked;
  const divideExact = document.getElementById('divide-exact').checked;

  const ops = [];
  if (useAdd) ops.push('+');
  if (useSubtract) ops.push('-');
  if (useMultiply) ops.push('×');
  if (useDivide) ops.push('÷');
  if (ops.length === 0) ops.push('+'); // 默认加法，确保生成

  exercises = [];
  answers = [];

  for (let i = 0; i < 30; i++) { // zgy
    let num1, num2, num3, num4, op1, op2, op3, result;
    let attempts = 0;
    const maxAttempts = 500;
    let currentLimit1 = limit1;
    let currentLimit2 = limit2;
    let currentLimit3 = limit3;
    let currentLimit4 = limit4;
    let validExercise = false;

    do {
      let range1 = (blank === '#1' || !currentLimit1) ? '0-999' : document.getElementById('range1').value;
      let range2 = (blank === '#2' || !currentLimit2) ? '0-999' : document.getElementById('range2').value;
      let range3 = (blank === '#3' || !currentLimit3 || !showOp2) ? '0-999' : document.getElementById('range3').value;
      let range4 = (blank === '#4' || !currentLimit4 || !showOp3) ? '0-999' : document.getElementById('range4').value;

      // 随机选择操作符
      op1 = ops[Math.floor(Math.random() * ops.length)];

      // 根据操作符和约束生成数字
      let validNumbers = false;
      let innerAttempts = 0;
      const maxInnerAttempts = 100;

      while (!validNumbers && innerAttempts < maxInnerAttempts) {
        num1 = getRandomNumber(range1);
        num2 = getRandomNumber(range2);

        // 检查操作符约束
        if (op1 === '+') {
          const hasCarry = requiresCarry(num1, num2);
          if ((addCarry && !hasCarry) || hasCarry) {
            innerAttempts++;
            continue;
          }
        } else if (op1 === '-') {
          // 确保结果为非负整数
          if (num1 < num2) {
            [num1, num2] = [num2, num1]; // 交换，确保结果为正
          }

          const hasBorrow = requiresBorrow(num1, num2);
          if ((subtractBorrow && !hasBorrow) || hasBorrow) {
            innerAttempts++;
            continue;
          }
        } else if (op1 === '×') {
          const hasCarry = multiplyRequiresCarry(num1, num2);
          if ((multiplyCarry && !hasCarry) || hasCarry) {
            innerAttempts++;
            continue;
          }
        } else if (op1 === '÷') {
          // 确保能够整除
          if (divideExact && (num2 === 0 || num1 % num2 !== 0)) {
            // 如果需要整除但不满足条件
            if (num2 === 0) num2 = 1; // 避免除以零
            else {
              // 调整num1使其能被num2整除
              num1 = num2 * Math.floor(Math.random() * 10 + 1);
            }
          }
        }

        validNumbers = true;
      }

      if (!validNumbers) {
        attempts++;
        continue;
      }

      // 计算第一步的结果，考虑运算符优先级
      let tempResult1 = calculate(num1, num2, op1);

      if (tempResult1 === null || tempResult1 < 0 || !Number.isInteger(tempResult1)) {
        attempts++;
        if (attempts > maxAttempts) break;
        continue;
      }

      if (showOp2) {
        op2 = ops[Math.floor(Math.random() * ops.length)];

        // 为op2生成有效的num3
        let validOp2 = false;
        innerAttempts = 0;

        while (!validOp2 && innerAttempts < maxInnerAttempts) {
          num3 = getRandomNumber(range3);

          // 检查op2约束
          if (op2 === '+') {
            const hasCarry = requiresCarry(tempResult1, num3);
            if ((addCarry && !hasCarry) || hasCarry) {
              innerAttempts++;
              continue;
            }
          } else if (op2 === '-') {
            // 确保结果为非负整数
            if (tempResult1 < num3) {
              innerAttempts++;
              continue;
            }
            const hasBorrow = requiresBorrow(tempResult1, num3);
            if ((subtractBorrow && !hasBorrow) || hasBorrow) {
              innerAttempts++;
              continue;
            }
          } else if (op2 === '×') {
            const hasCarry = multiplyRequiresCarry(tempResult1, num3);
            if ((multiplyCarry && !hasCarry) || hasCarry) {
              innerAttempts++;
              continue;
            }
          } else if (op2 === '÷') {
            // 确保能够整除
            if (divideExact && (num3 === 0 || tempResult1 % num3 !== 0)) {
              innerAttempts++;
              continue;
            }
          }

          validOp2 = true;
        }

        if (!validOp2) {
          attempts++;
          continue;
        }

        // 计算前两个操作的结果，考虑运算符优先级
        let tempResult2 = calculateExpression([num1, num2, num3], [op1, op2]);

        if (tempResult2 === null || tempResult2 < 0 || !Number.isInteger(tempResult2)) {
          attempts++;
          if (attempts > maxAttempts) break;
          continue;
        }

        if (showOp3) {
          op3 = ops[Math.floor(Math.random() * ops.length)];

          // 为op3生成有效的num4
          let validOp3 = false;
          innerAttempts = 0;

          while (!validOp3 && innerAttempts < maxInnerAttempts) {
            num4 = getRandomNumber(range4);

            // 检查op3约束
            if (op3 === '+') {
              const hasCarry = requiresCarry(tempResult2, num4);
              if ((addCarry && !hasCarry) || hasCarry) {
                innerAttempts++;
                continue;
              }
            } else if (op3 === '-') {
              // 确保结果为非负整数
              if (tempResult2 < num4) {
                innerAttempts++;
                continue;
              }
              const hasBorrow = requiresBorrow(tempResult2, num4);
              if ((subtractBorrow && !hasBorrow) || hasBorrow) {
                innerAttempts++;
                continue;
              }
            } else if (op3 === '×') {
              const hasCarry = multiplyRequiresCarry(tempResult2, num4);
              if ((multiplyCarry && !hasCarry) ||  hasCarry) {
                innerAttempts++;
                continue;
              }
            } else if (op3 === '÷') {
              // 确保能够整除
              if (divideExact && (num4 === 0 || tempResult2 % num4 !== 0)) {
                innerAttempts++;
                continue;
              }
            }
            validOp3 = true;
          }

          if (!validOp3) {
            attempts++;
            continue;
          }

          // 计算最终结果，考虑运算符优先级
          result = calculateExpression([num1, num2, num3, num4], [op1, op2, op3]);

          if (result === null || result < 0 || !Number.isInteger(result)) {
            attempts++;
            if (attempts > maxAttempts) break;
            continue;
          }
        } else {
          result = tempResult2;
        }
      } else {
        result = tempResult1;
      }

      validExercise = true;

      if (attempts > maxAttempts) {
        // 逐步放宽限制
        if (blank === '#4' && currentLimit4) {
          currentLimit4 = false;
        } else if (blank === '#3' && currentLimit3) {
          currentLimit3 = false;
        } else if (blank === '#2' && currentLimit2) {
          currentLimit2 = false;
        } else if (blank === '#1' && currentLimit1) {
          currentLimit1 = false;
        } else {
          // 如果所有限制都已放宽，仍然无法生成，则跳出循环
          break;
        }
        attempts = 0; // 重置尝试次数
      }

    } while (!validExercise);

    if (!validExercise) {
      console.warn(`无法生成第 ${i + 1} 道习题，跳过。`);
      continue; // 如果超过最大尝试次数仍然无法生成，则跳过这道题
    }

    let exercise = '';
    let answer = '';
    if (blank === '#1') {
      exercise = `<input type="text" id="answer-${i}" size="3"> ${op1} ${num2} ${showOp2 ? op2 + ' ' + num3 : ''} ${showOp3 ? op3 + ' ' + num4 : ''} = ${result}`;
      answer = num1;
    } else if (blank === '#2') {
      exercise = `${num1} ${op1} <input type="text" id="answer-${i}" size="3"> ${showOp2 ? op2 + ' ' + num3 : ''} ${showOp3 ? op3 + ' ' + num4 : ''} = ${result}`;
      answer = num2;
    } else if (blank === '#3' && showOp2) {
      exercise = `${num1} ${op1} ${num2} ${op2} <input type="text" id="answer-${i}" size="3"> ${showOp3 ? op3 + ' ' + num4 : ''} = ${result}`;
      answer = num3;
    } else if (blank === '#3' && !showOp2) {
      exercise = `${num1} ${op1} ${num2} = <input type="text" id="answer-${i}" size="3">`;
      answer = result;
    } else if (blank === '#4' && showOp2 && showOp3) {
      exercise = `${num1} ${op1} ${num2} ${op2} ${num3} ${op3} <input type="text" id="answer-${i}" size="3"> = ${result}`;
      answer = num4;
    } else if (blank === '#4' && showOp2 && !showOp3) {
      exercise = `${num1} ${op1} ${num2} ${op2} ${num3} = <input type="text" id="answer-${i}" size="3">`;
      answer = result;
    } else if (blank === 'op1') {
      exercise = `${num1} <select id="answer-${i}"><option value="+">+</option><option value="-">-</option><option value="×">×</option><option value="÷">÷</option></select> ${num2} ${showOp2 ? op2 + ' ' + num3 : ''} ${showOp3 ? op3 + ' ' + num4 : ''} = ${result}`;
      answer = op1;
    } else if (blank === 'op2' && showOp2) {
      exercise = `${num1} ${op1} ${num2} <select id="answer-${i}"><option value="+">+</option><option value="-">-</option><option value="×">×</option><option value="÷">÷</option></select> ${num3} ${showOp3 ? op3 + ' ' + num4 : ''} = ${result}`;
      answer = op2;
    } else if (blank === 'op3' && showOp3) {
      exercise = `${num1} ${op1} ${num2} ${op2} ${num3} <select id="answer-${i}"><option value="+">+</option><option value="-">-</option><option value="×">×</option><option value="÷">÷</option></select> ${num4} = ${result}`;
      answer = op3;
    }

    if (exercise) {
      exercises.push({text: exercise, num1, num2, num3, num4, op1, op2, op3, result, showOp2, showOp3});
      answers.push(answer);
    }
  }
  displayExercises();
  displayAnswers();
}

// 获取随机数
function getRandomNumber(range) {
  const [min, max] = range.split('-').map(Number);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// 显示习题
function displayExercises() {
  const exercisesDiv = document.getElementById('exercises');
  exercisesDiv.innerHTML = exercises.map((e, i) =>
    `<div class="exercise-item"><span class="num">${i + 1}.</span> ${e.text} <span class="result hidden"></span></div>`
  ).join('');
  exercisesDiv.classList.remove('hidden');
}

// 显示答案
function displayAnswers() {
  const answersDiv = document.getElementById('answers');
  answersDiv.innerHTML = answers.map((a, i) =>
    `<div class="answer-item">${i + 1}. ${a}</div>`
  ).join('');
  answersDiv.classList.remove('hidden');
  // 确保答案区域初始时是旋转的
  answersDiv.classList.remove('show-answers');
}

// 重置状态
function resetState() {
  // 重置计时器
  timeElapsed = 0;
  document.getElementById('timer').textContent = 'Countdown: 0 S';
  document.getElementById('timer').classList.remove('timer-highlight');
  clearInterval(timer);
  timerRunning = false;

  // 重置评分和评价
  document.getElementById('score').textContent = '0';
  document.getElementById('stars').querySelectorAll('.star').forEach(star => {
    star.className = 'star empty';
    star.textContent = '☆';
  });
  document.getElementById('comment').textContent = '';

  // 隐藏统计信息
  document.getElementById('stats').classList.add('hidden');

  // 清除结果标记
  document.querySelectorAll('.result').forEach(r => {
    r.classList.add('hidden');
    r.textContent = '';
  });

  // 清除输入框和下拉框的值
  const exercisesDiv = document.getElementById('exercises');
  if (exercisesDiv) {
    const inputs = exercisesDiv.querySelectorAll('input');
    inputs.forEach(input => {
      input.value = '';
      input.classList.remove('auto-answer');
    });

    const selects = exercisesDiv.querySelectorAll('select');
    selects.forEach(select => {
      select.selectedIndex = 0;
      select.classList.remove('auto-answer');
    });
  }

  // 确保答案区域恢复到旋转状态
  const answersDiv = document.getElementById('answers');
  answersDiv.classList.remove('show-answers');
}

// 开始计时
function startTimer() {
  if (exercises.length === 0) {
    alert('请先生成习题！');
    return;
  }

  // 清除之前的答题痕迹
  resetState();

  clearInterval(timer);
  timeElapsed = 0;
  document.getElementById('timer').textContent = 'Countdown: 0 S';
  document.getElementById('timer').classList.add('timer-highlight');
  timerRunning = true;
  timer = setInterval(() => {
    timeElapsed++;
    document.getElementById('timer').textContent = `Countdown: ${timeElapsed} S`;
  }, 1000);
}

// 显示对话框
function showDialog(message, duration = 5000) {
  // 创建对话框元素
  const dialog = document.createElement('div');
  dialog.className = 'dialog';
  dialog.textContent = message;

  // 添加到页面
  document.body.appendChild(dialog);

  // 设置定时器自动关闭
  setTimeout(() => {
    document.body.removeChild(dialog);
  }, duration);
}

// 停止计时并批改（验算答案）
function stopTimerAndGrade() {
  // 检查是否有答题
  const inputs = document.querySelectorAll('#exercises input, #exercises select');
  let hasAnswers = false;

  for (const input of inputs) {
    if (input.value.trim() !== '') {
      hasAnswers = true;
      break;
    }
  }

  if (!hasAnswers) {
    showDialog('尚未答题，请答题！');
    return;
  }

  clearInterval(timer);
  timerRunning = false;
  document.getElementById('timer').classList.add('timer-highlight');

  let score = 0;
  let correctCount = 0;
  let wrongCount = 0;
  const blank = document.getElementById('blank').value;

  exercises.forEach((exercise, index) => {
    const answerInput = document.getElementById(`answer-${index}`);
    if (!answerInput) return;

    const userAnswer = answerInput.tagName === 'SELECT' ?
      answerInput.value :
      answerInput.value.trim();

    const resultSpan = answerInput.parentElement.querySelector('.result');
    resultSpan.classList.remove('hidden');

    let isCorrect = false;

    // 根据填空位置验算
    if (blank === '#1') {
      // 用户填写的是第一个数字
      const nums = [parseFloat(userAnswer), exercise.num2];
      if (exercise.showOp2) nums.push(exercise.num3);
      if (exercise.showOp3) nums.push(exercise.num4);

      const ops = [exercise.op1];
      if (exercise.showOp2) ops.push(exercise.op2);
      if (exercise.showOp3) ops.push(exercise.op3);

      const calculatedResult = calculateExpression(nums, ops);
      isCorrect = calculatedResult === exercise.result;
    } else if (blank === '#2') {
      // 用户填写的是第二个数字
      const nums = [exercise.num1, parseFloat(userAnswer)];
      if (exercise.showOp2) nums.push(exercise.num3);
      if (exercise.showOp3) nums.push(exercise.num4);

      const ops = [exercise.op1];
      if (exercise.showOp2) ops.push(exercise.op2);
      if (exercise.showOp3) ops.push(exercise.op3);

      const calculatedResult = calculateExpression(nums, ops);
      isCorrect = calculatedResult === exercise.result;
    } else if (blank === '#3') {
      if (exercise.showOp2) {
        // 用户填写的是第三个数字
        const nums = [exercise.num1, exercise.num2, parseFloat(userAnswer)];
        if (exercise.showOp3) nums.push(exercise.num4);

        const ops = [exercise.op1, exercise.op2];
        if (exercise.showOp3) ops.push(exercise.op3);

        const calculatedResult = calculateExpression(nums, ops);
        isCorrect = calculatedResult === exercise.result;
      } else {
        // 如果不显示op2，等式是 #1 op1 #2 = #3，所以要比较userAnswer和result
        isCorrect = Math.abs(parseFloat(userAnswer) - exercise.result) < 1e-6;
      }
    } else if (blank === '#4') {
      if (exercise.showOp3) {
        // 用户填写的是第四个数字
        const nums = [exercise.num1, exercise.num2, exercise.num3, parseFloat(userAnswer)];
        const ops = [exercise.op1, exercise.op2, exercise.op3];

        const calculatedResult = calculateExpression(nums, ops);
        isCorrect = calculatedResult === exercise.result;
      } else {
        // 如果不显示op3，等式是 #1 op1 #2 op2 #3 = #4，所以要比较userAnswer和result
        isCorrect = Math.abs(parseFloat(userAnswer) - exercise.result) < 1e-6;
      }
    } else if (blank === 'op1') {
      // 用户选择的是第一个操作符
      const nums = [exercise.num1, exercise.num2];
      if (exercise.showOp2) nums.push(exercise.num3);
      if (exercise.showOp3) nums.push(exercise.num4);

      const ops = [userAnswer];
      if (exercise.showOp2) ops.push(exercise.op2);
      if (exercise.showOp3) ops.push(exercise.op3);

      const calculatedResult = calculateExpression(nums, ops);
      isCorrect = calculatedResult === exercise.result;
    } else if (blank === 'op2') {
      // 用户选择的是第二个操作符
      const nums = [exercise.num1, exercise.num2, exercise.num3];
      if (exercise.showOp3) nums.push(exercise.num4);

      const ops = [exercise.op1, userAnswer];
      if (exercise.showOp3) ops.push(exercise.op3);

      const calculatedResult = calculateExpression(nums, ops);
      isCorrect = calculatedResult === exercise.result;
    } else if (blank === 'op3') {
      // 用户选择的是第三个操作符
      const nums = [exercise.num1, exercise.num2, exercise.num3, exercise.num4];
      const ops = [exercise.op1, exercise.op2, userAnswer];

      const calculatedResult = calculateExpression(nums, ops);
      isCorrect = calculatedResult === exercise.result;
    }

    resultSpan.textContent = isCorrect ? '✓' : '✗';

    if (isCorrect) {
      correctCount++;
      score += 5; // 每题5分
    } else {
      wrongCount++;
    }
  });

  // 更新分数
  document.getElementById('score').textContent = score;

  // 更新星级评价
  updateStars(score);

  // 显示统计信息
  document.getElementById('correct-count').textContent = correctCount;
  document.getElementById('wrong-count').textContent = wrongCount;
  document.getElementById('stats').classList.remove('hidden');

  // 显示答案
  document.getElementById('answers').classList.add('show-answers');
}

// 更新星级评价
function updateStars(score) {
  const stars = document.getElementById('stars').querySelectorAll('.star');
  let filledStars = 0;
  let comment = '';

  if (score >= 95) {
    filledStars = 6;
    comment = '太棒了！你真是数学小天才！';
  } else if (score >= 90) {
    filledStars = 5;
    comment = '非常优秀！继续保持！';
  } else if (score >= 80) {
    filledStars = 4;
    comment = '很好！再接再厉！';
  } else if (score >= 70) {
    filledStars = 3;
    comment = '不错，还有提升空间！';
  } else if (score >= 60) {
    filledStars = 2;
    comment = '及格了，但需要更多练习！';
  } else {
    filledStars = 1;
    comment = '需要加强练习，相信你能做得更好！';
  }

  // 更新星星显示
  for (let i = 0; i < stars.length; i++) {
    if (i < filledStars) {
      stars[i].className = 'star filled';
      stars[i].textContent = '★';
    } else {
      stars[i].className = 'star empty';
      stars[i].textContent = '☆';
    }
  }

  // 更新评语
  document.getElementById('comment').textContent = comment;
}

// 自动填写答案
function autoFillAnswers() {
  if (exercises.length === 0) {
    alert('请先生成习题！');
    return;
  }

  // 清除之前的答题痕迹
  resetState();

  const randomize = document.getElementById('randomizeAnswers').checked;

  exercises.forEach((exercise, index) => {
    const answerInput = document.getElementById(`answer-${index}`);
    if (!answerInput) return;

    let correctAnswer = answers[index];

    if (answerInput.tagName === 'SELECT') {
      // 对于下拉选择框
      const options = answerInput.options;
      for (let i = 0; i < options.length; i++) {
        if (options[i].value === correctAnswer) {
          answerInput.selectedIndex = i;
          break;
        }
      }
    } else {
      // 对于文本输入框
      let finalAnswer = correctAnswer;
      if (randomize) {
        const errorPercentage = Math.floor(Math.random() * (90 - 10 + 1)) + 10; // 10% 到 90%
        if (Math.random() < errorPercentage / 100) {
          finalAnswer += Math.random() < 0.5 ? 1 : -1;
        }
      }
      answerInput.value = finalAnswer;
    }

    // 添加自动填充的样式
    answerInput.classList.add('auto-answer');
  });
}

function mPrint(elementId) {
  // 需要打印的局部区域赋予"print-wrap"的id
  let el = document.getElementById(elementId);
  let doc = document;
  let body = doc.body || doc.getElementsByTagName("body")[0];
  let printId = "print-" + Date.now();

  // 创建无副作用的打印容器(因不确定页面的打印元素有无其它样式)
  let content = doc.createElement("div");
  content.id = printId;

  // 样式控制与打印无关的元素隐藏
  let style = doc.createElement("style");
  style.innerHTML =
    "body>#" +
    printId +
    "{display:none}@media print{body>:not(#" +
    printId +
    "){display:none !important}body>#" +
    printId +
    "{display:block;padding-top:1px}}";

  content.innerHTML = el.outerHTML;
   //console.log("el.outerHTML", el.outerHTML);
  body.appendChild(style);

  // 与style元素设置的样式相配合
  // 把打印内容的元素添加到body(作为body的子元素，可用body的子选择器 '>' 控制打印样式)
  body.appendChild(content);
  setTimeout(() => {
    window.print();
    body.removeChild(content);
    body.removeChild(style);
  }, 20);
}

// 设置难度预设
function setDifficultyPresets(level) {
  // 重置所有选项
  document.getElementById('add').checked = false;
  document.getElementById('subtract').checked = false;
  document.getElementById('multiply').checked = false;
  document.getElementById('divide').checked = false;
  document.getElementById('add-carry').checked = false;
  //document.getElementById('add-no-carry').checked = false;
  document.getElementById('subtract-borrow').checked = false;
  //document.getElementById('subtract-no-borrow').checked = false;
  document.getElementById('multiply-carry').checked = false;
  //document.getElementById('multiply-no-carry').checked = false;
  document.getElementById('divide-exact').checked = false;
  //document.getElementById('moveTerms').checked = false;

  // 根据难度级别设置
  switch (level) {
    case 1: // 简单
      document.getElementById('add').checked = true;
      document.getElementById('add-no-carry').checked = true;
      document.getElementById('range1').value = '0-9';
      document.getElementById('range2').value = '0-9';
      document.getElementById('showOp2').checked = false;
      document.getElementById('showOp3').checked = false;
      break;
    case 2: // 较易
      document.getElementById('add').checked = true;
      document.getElementById('subtract').checked = true;
      //document.getElementById('add-no-carry').checked = true;
      //document.getElementById('subtract-no-borrow').checked = true;
      document.getElementById('range1').value = '2-9';
      document.getElementById('range2').value = '2-9';
      document.getElementById('showOp2').checked = true;
      document.getElementById('showOp3').checked = false;
      break;
    case 3: // 中等
      document.getElementById('add').checked = true;
      document.getElementById('subtract').checked = true;
      document.getElementById('multiply').checked = true;
      document.getElementById('add-carry').checked = true;
      document.getElementById('subtract-borrow').checked = true;
      //document.getElementById('multiply-no-carry').checked = true;
      document.getElementById('range1').value = '10-50';
      document.getElementById('range2').value = '10-50';
      document.getElementById('range3').value = '2-9';
      document.getElementById('showOp2').checked = true;
      document.getElementById('showOp3').checked = false;
      break;
    case 4: // 较难
      document.getElementById('add').checked = true;
      document.getElementById('subtract').checked = true;
      document.getElementById('multiply').checked = true;
      document.getElementById('divide').checked = true;
      document.getElementById('add-carry').checked = true;
      document.getElementById('subtract-borrow').checked = true;
      document.getElementById('multiply-carry').checked = true;
      document.getElementById('divide-exact').checked = true;
      document.getElementById('range1').value = '10-50';
      document.getElementById('range2').value = '10-50';
      document.getElementById('range3').value = '2-9';
      document.getElementById('showOp2').checked = true;
      document.getElementById('showOp3').checked = true;
      break;
    case 5: // 困难
      document.getElementById('add').checked = true;
      document.getElementById('subtract').checked = true;
      document.getElementById('multiply').checked = true;
      document.getElementById('divide').checked = true;
      document.getElementById('add-carry').checked = true;
      document.getElementById('subtract-borrow').checked = true;
      document.getElementById('multiply-carry').checked = true;
      document.getElementById('divide-exact').checked = true;
      //document.getElementById('moveTerms').checked = true;
      document.getElementById('range1').value = '51-99';
      document.getElementById('range2').value = '51-99';
      document.getElementById('range3').value = '10-50';
      document.getElementById('range4').value = '2-9';
      document.getElementById('showOp2').checked = true;
      document.getElementById('showOp3').checked = true;
      break;
  }

  // 更新禁用状态
  document.getElementById('add-carry').disabled = !document.getElementById('add').checked;
  //document.getElementById('add-no-carry').disabled = !document.getElementById('add').checked;
  document.getElementById('subtract-borrow').disabled = !document.getElementById('subtract').checked;
  //document.getElementById('subtract-no-borrow').disabled = !document.getElementById('subtract').checked;
  document.getElementById('multiply-carry').disabled = !document.getElementById('multiply').checked;
  //document.getElementById('multiply-no-carry').disabled = !document.getElementById('multiply').checked;
  document.getElementById('divide-exact').disabled = !document.getElementById('divide').checked;
}

// 显示对话框
function showDialog(message, duration = 5000) {
  // 创建对话框元素
  const dialog = document.createElement('div');
  dialog.className = 'dialog';
  dialog.textContent = message;

  // 添加到页面
  document.body.appendChild(dialog);

  // 设置定时器自动关闭
  setTimeout(() => {
    document.body.removeChild(dialog);
  }, duration);
}

// 获取随机数
function getRandomNumber(range) {
  const [min, max] = range.split('-').map(Number);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// 显示习题
function displayExercises() {
  const exercisesDiv = document.getElementById('exercises');
  let eNumber = "";
  exercisesDiv.innerHTML = exercises.map((e, i) => {
    // 替换输入框，添加唯一ID
    let exerciseText = e.text;
    if (exerciseText.includes('<input')) {
      exerciseText = exerciseText.replace('<input', `<input id="answer-${i}"`);
    } else if (exerciseText.includes('<select')) {
      exerciseText = exerciseText.replace('<select', `<select id="answer-${i}"`);
    }
      if(i + 1 < 10) eNumber = "0"+(i+1);
      else  eNumber = (i+1)+"";
    return `<div class="exercise-item"><span class="num">${eNumber}.</span> ${exerciseText} <span class="result hidden"></span></div>`;
  }).join('');
  exercisesDiv.classList.remove('hidden');
}

// 显示答案
function displayAnswers() {
  const answersDiv = document.getElementById('answers');
  answersDiv.innerHTML = answers.map((a, i) =>
    `<div class="answer-item">${i + 1}. ${a}</div>`
  ).join('');
  answersDiv.classList.remove('hidden');
  // 确保答案区域初始时是旋转的
  answersDiv.classList.remove('show-answers');
}

// 开始计时
function startTimer() {
  if (exercises.length === 0) {
    alert('请先生成习题！');
    return;
  }

  // 清除之前的答题痕迹
  resetState();

  clearInterval(timer);
  timeElapsed = 0;
  document.getElementById('timer').textContent = 'Countdown: 0 S';
  document.getElementById('timer').classList.add('timer-highlight');
  timer = setInterval(() => {
    timeElapsed++;
    document.getElementById('timer').textContent = `Countdown: ${timeElapsed} S`;
  }, 1000);
  timerRunning = true;
}

// 停止计时并批改
function stopTimerAndGrade() {
  // 检查是否有答题
  const inputs = document.querySelectorAll('#exercises input, #exercises select');
  let hasAnswers = false;

  for (const input of inputs) {
    if (input.value.trim() !== '') {
      hasAnswers = true;
      break;
    }
  }

  if (!hasAnswers) {
    showDialog('Not yet answer，Answer first！');
    return;
  }

  clearInterval(timer);
  timerRunning = false;
  document.getElementById('timer').classList.add('timer-highlight');

  let score = 0;
  let correctCount = 0;
  const blank = document.getElementById('blank').value;

  inputs.forEach((input, i) => {
    const userAnswer = input.value.trim();
    const exercise = exercises[i];
    const resultSpan = input.parentElement.querySelector('.result');
    let isCorrect = false;

    // 根据填空位置验算
    if (blank === '#1') {
      const n1 = parseFloat(userAnswer);
      if (!isNaN(n1)) {
        // 使用新的计算表达式函数，考虑运算符优先级
        const nums = [n1, exercise.num2];
        const ops = [exercise.op1];

        if (exercise.showOp2) {
          nums.push(exercise.num3);
          ops.push(exercise.op2);

          if (exercise.showOp3) {
            nums.push(exercise.num4);
            ops.push(exercise.op3);
          }
        }

        const computedResult = calculateExpression(nums, ops);
        isCorrect = (computedResult !== null && Math.abs(computedResult - exercise.result) < 1e-6);
      }
    } else if (blank === '#2') {
      const n2 = parseFloat(userAnswer);
      if (!isNaN(n2)) {
        // 使用新的计算表达式函数，考虑运算符优先级
        const nums = [exercise.num1, n2];
        const ops = [exercise.op1];

        if (exercise.showOp2) {
          nums.push(exercise.num3);
          ops.push(exercise.op2);

          if (exercise.showOp3) {
            nums.push(exercise.num4);
            ops.push(exercise.op3);
          }
        }

        const computedResult = calculateExpression(nums, ops);
        isCorrect = (computedResult !== null && Math.abs(computedResult - exercise.result) < 1e-6);
      }
    } else if (blank === '#3') {
      const n3 = parseFloat(userAnswer);
      if (!isNaN(n3)) {
        if (exercise.showOp2) {
          // 使用新的计算表达式函数，考虑运算符优先级
          const nums = [exercise.num1, exercise.num2, n3];
          const ops = [exercise.op1, exercise.op2];

          if (exercise.showOp3) {
            nums.push(exercise.num4);
            ops.push(exercise.op3);
          }

          const computedResult = calculateExpression(nums, ops);
          isCorrect = (computedResult !== null && Math.abs(computedResult - exercise.result) < 1e-6);
        } else {
          // 如果不显示op2，等式是 #1 op1 #2 = #3，所以要比较userAnswer和result
          isCorrect = (Math.abs(n3 - exercise.result) < 1e-6);
        }
      }
    } else if (blank === '#4') {
      const n4 = parseFloat(userAnswer);
      if (!isNaN(n4)) {
        if (exercise.showOp3) {
          // 使用新的计算表达式函数，考虑运算符优先级
          const nums = [exercise.num1, exercise.num2, exercise.num3, n4];
          const ops = [exercise.op1, exercise.op2, exercise.op3];

          const computedResult = calculateExpression(nums, ops);
          isCorrect = (computedResult !== null && Math.abs(computedResult - exercise.result) < 1e-6);
        } else {
          // 如果不显示op3，等式是 #1 op1 #2 op2 #3 = #4，所以要比较userAnswer和result
          isCorrect = (Math.abs(n4 - exercise.result) < 1e-6);
        }
      }
    } else if (blank === 'op1') {
      const selectedOp = userAnswer;
      // 使用新的计算表达式函数，考虑运算符优先级
      const nums = [exercise.num1, exercise.num2];
      const ops = [selectedOp];

      if (exercise.showOp2) {
        nums.push(exercise.num3);
        ops.push(exercise.op2);

        if (exercise.showOp3) {
          nums.push(exercise.num4);
          ops.push(exercise.op3);
        }
      }

      const computedResult = calculateExpression(nums, ops);
      isCorrect = (computedResult !== null && Math.abs(computedResult - exercise.result) < 1e-6 && selectedOp === exercise.op1);
    } else if (blank === 'op2') {
      const selectedOp = userAnswer;
      // 使用新的计算表达式函数，考虑运算符优先级
      const nums = [exercise.num1, exercise.num2, exercise.num3];
      const ops = [exercise.op1, selectedOp];

      if (exercise.showOp3) {
        nums.push(exercise.num4);
        ops.push(exercise.op3);
      }

      const computedResult = calculateExpression(nums, ops);
      isCorrect = (computedResult !== null && Math.abs(computedResult - exercise.result) < 1e-6 && selectedOp === exercise.op2);
    } else if (blank === 'op3') {
      const selectedOp = userAnswer;
      // 使用新的计算表达式函数，考虑运算符优先级
      const nums = [exercise.num1, exercise.num2, exercise.num3, exercise.num4];
      const ops = [exercise.op1, exercise.op2, selectedOp];

      const computedResult = calculateExpression(nums, ops);
      isCorrect = (computedResult !== null && Math.abs(computedResult - exercise.result) < 1e-6 && selectedOp === exercise.op3);
    }

    resultSpan.classList.remove('hidden');
    if (isCorrect) {
      resultSpan.textContent = '✔';
      score += 5;
      correctCount++;
    } else {
      resultSpan.textContent = '✘';
    }
  });

  document.getElementById('score').textContent = score;
  document.getElementById('correct-count').textContent = correctCount;
  document.getElementById('wrong-count').textContent = inputs.length - correctCount;
  document.getElementById('stats').classList.remove('hidden');
  updateStars(score);

  // 旋转答案区域，使其正向显示
  const answersDiv = document.getElementById('answers');
  answersDiv.classList.add('show-answers');
  answersShown = true;
}

// 重置状态
function resetState() {
  // 重置计时器
  timeElapsed = 0;
  document.getElementById('timer').textContent = 'Countdown: 0 S';
  document.getElementById('timer').classList.remove('timer-highlight');
  clearInterval(timer);
  timerRunning = false;

  // 重置评分和评价
  document.getElementById('score').textContent = '0';
  document.getElementById('stats').classList.add('hidden');

  // 隐藏结果标记
  document.querySelectorAll('.result').forEach(r => {
    r.classList.add('hidden');
    r.textContent = '';
  });

  // 重置星级评价
  const starsDiv = document.getElementById('stars');
  starsDiv.innerHTML = `评价：
                <span class="star empty">☆</span>
                <span class="star empty">☆</span>
                <span class="star empty">☆</span>
                <span class="star empty">☆</span>
                <span class="star empty">☆</span>
                <span class="star empty">☆</span>
            `;
  document.getElementById('comment').textContent = '';

  // 清除输入框和选择框的值和样式
  const inputs = document.querySelectorAll('#exercises input');
  inputs.forEach(input => {
    input.value = '';
    input.classList.remove('auto-answer');
  });

  const selects = document.querySelectorAll('#exercises select');
  selects.forEach(select => {
    select.selectedIndex = 0;
    select.classList.remove('auto-answer');
  });

  // 确保答案区域恢复到旋转状态
  const answersDiv = document.getElementById('answers');
  answersDiv.classList.remove('show-answers');
  answersShown = false;
}

// 初始化
window.onload = function () {
  const today = new Date();
  document.getElementById('year').value = today.getFullYear();
  document.getElementById('month').value = String(today.getMonth() + 1).padStart(2, '0');
  document.getElementById('day').value = String(today.getDate()).padStart(2, '0');
  //updateDisabledRanges(); // 初始化时更新范围限制显示

  // 设置运算类型的联动
  document.getElementById('add').addEventListener('change', function () {
    const checked = this.checked;
    document.getElementById('add-carry').disabled = !checked;
    document.getElementById('add-no-carry').disabled = !checked;
  });

  document.getElementById('subtract').addEventListener('change', function () {
    const checked = this.checked;
    document.getElementById('subtract-borrow').disabled = !checked;
    document.getElementById('subtract-no-borrow').disabled = !checked;
  });

  document.getElementById('multiply').addEventListener('change', function () {
    const checked = this.checked;
    document.getElementById('multiply-carry').disabled = !checked;
    document.getElementById('multiply-no-carry').disabled = !checked;
  });

  document.getElementById('divide').addEventListener('change', function () {
    const checked = this.checked;
    document.getElementById('divide-exact').disabled = !checked;
  });

  // 初始化禁用状态
  document.getElementById('add-carry').disabled = !document.getElementById('add').checked;
  //document.getElementById('add-no-carry').disabled = !document.getElementById('add').checked;
  document.getElementById('subtract-borrow').disabled = !document.getElementById('subtract').checked;
  //document.getElementById('subtract-no-borrow').disabled = !document.getElementById('subtract').checked;
  document.getElementById('multiply-carry').disabled = !document.getElementById('multiply').checked;
  //document.getElementById('multiply-no-carry').disabled = !document.getElementById('multiply').checked;
  document.getElementById('divide-exact').disabled = !document.getElementById('divide').checked;

  // 设置难度滑块的事件
  document.getElementById('difficultySlider').addEventListener('change', function () {
    setDifficultyPresets(parseInt(this.value));
  });

  // 初始化设置难度
  setDifficultyPresets(2);
  generateExercises();
}
