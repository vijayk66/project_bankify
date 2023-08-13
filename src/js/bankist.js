"use script";

//user data
const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2,
  pin: 1111,
  username: "js",
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
  username: "jd",
};

const account3 = {
  owner: "Steven Thomas Williams",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
  username: "stw",
};

const account4 = {
  owner: "Sarah Smith",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
  username: "ss",
};

const accounts = [account1, account2, account3, account4];

const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");
const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");
const btnLogin = document.querySelector(".login__btn");
const welcome = document.querySelector(".welcome_msg")
const login = document.querySelector(".login");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");
const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

// Display movements
const displayMovements = function (mov, sort = false) {
  containerMovements.innerHTML = "";
  let movements = sort ? mov.slice().sort((a,b) => a - b ) : mov;
  movements.forEach((mov, i) => {
    let type = mov > 0 ? "deposit" : "withdrawal";
    let movementsHtml = `
      <div class="movements__row">
      <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
      <div class="movements__date">3 days ago</div>
      <div class="movements__value">${mov}€</div>
      </div>
      `;
    containerMovements.insertAdjacentHTML("afterbegin", movementsHtml);
  });

};

//Current Balance
const updateCurrentbalance = function (curAcc) {
  let mov = curAcc.movements;
  let date = new Date();

  let dateNow = `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`;
  labelDate.textContent = dateNow;

  let currentBalance = mov.reduce((acc, cur) => acc + cur, 0);
  labelBalance.textContent = `${currentBalance} €`;

  let totalIn = mov.filter((el) => el > 0).reduce((acc, cur) => acc + cur, 0);
  labelSumIn.textContent = `${totalIn} €`;

  let totalOut = mov.filter((el) => el < 0).reduce((acc, cur) => acc + cur, 0);
  labelSumOut.textContent = `${totalOut} €`;

  let totalInt = mov
    .filter((el) => el > 0)
    .map((el) => el * (curAcc.interestRate / 100))
    .filter((el) => el >= 1)
    .reduce((acc, cur) => acc + cur, 0);
  console.log(totalInt);
  labelSumInterest.textContent = `${totalInt} €`;
};

//Trannsfer Money
const transferMoney = function (curAcc) {
  let receivername = inputTransferTo.value;
  let receiverAcc = accounts.find((el) => el.username === receivername);
  let transferMoney = +inputTransferAmount.value;
  let sendername = curAcc.username;
  let currentBalance = Number.parseInt(labelBalance.textContent);

  if (
    receivername !== sendername &&
    transferMoney >= 0 &&
    transferMoney < currentBalance
  ) {
    receiverAcc.movements.push(transferMoney);
    curAcc.movements.push(-transferMoney);
  } else {
    console.log("something went wrong");
  }
};

//Transfer Loan
const loanTransfer = function (curAcc) {
  let loanAmt = +inputLoanAmount.value;
  let currentBalance = Number.parseInt(labelBalance.textContent);
  let loanlimit = (currentBalance * 50) / 100;

  if (loanAmt > 0 && loanAmt < loanlimit) {
    curAcc.movements.push(loanAmt);
  } else {
    return
  }
};

//Timer
let timer;
const settimer = function () {
  let timeout = 359;

  const timerFun = function () {
    let min = String(parseInt(timeout / 60)).padStart(2, 0);
    let sec = String(timeout % 60).padStart(2, 0);
    labelTimer.textContent = `${min}:${sec}`;

    if (timeout <= 0) {
      containerApp.style.opacity = "0";
      labelWelcome.textContent = "Log in to continue 😔";
      clearInterval(timer);
    }

    timeout--;
  }
  timer = setInterval(timerFun, 1000);
};


let currentAccount;

//Implementing Login

btnLogin.addEventListener("click", function (e) {
  e.preventDefault();
  let username = inputLoginUsername.value.trim().toLocaleLowerCase();
  let pin = +inputLoginPin.value;
  currentAccount = accounts.find((el) => el.username === username);

  if (pin === currentAccount.pin) {
    welcome.style.display="none"
    containerApp.style.opacity = "1";
    inputLoginUsername.value = inputLoginPin.value = "";
    inputLoginPin.blur();
    displayMovements(currentAccount.movements);
    updateCurrentbalance(currentAccount);
    labelWelcome.textContent = `Welcome back ${
      currentAccount.owner.split(" ")[0]
    }`;

    if (timer) clearInterval(timer);
    settimer();
  }
});

btnTransfer.addEventListener("click", function (e) {
  e.preventDefault();
  transferMoney(currentAccount);
  displayMovements(currentAccount.movements);
  updateCurrentbalance(currentAccount);
  clearInterval();
  if (timer) clearInterval(timer);
  settimer();
});

btnLoan.addEventListener("click", function (e) {
  e.preventDefault();
  loanTransfer(currentAccount);
  displayMovements(currentAccount.movements);
  updateCurrentbalance(currentAccount);
  clearInterval();
  if (timer) clearInterval(timer);
  settimer();
});

btnClose.addEventListener("click", function (e) {
  e.preventDefault();
  let closeUsername = inputCloseUsername.value;
  let closeUserPin = +inputClosePin.value;

  if (
    currentAccount.pin === closeUserPin &&
    currentAccount.username === closeUsername
  ) {
    containerApp.style.opacity = '0'
    inputCloseUsername.value = inputClosePin.value = "";
    inputClosePin.blur();
    labelWelcome.textContent = "Log in to continue 😔";
  }
});

let sortboolean = false;

btnSort.addEventListener('click', function(e){
  e.preventDefault();
  displayMovements(currentAccount.movements, !sortboolean)
  sortboolean = !sortboolean // true
})