class Account {
    constructor(owner, currency, pin, interestRate) {
        this.owner = owner;
        this.currency = currency;
        this.userName = '';
        this._pin = pin;
        this._interestRate = interestRate
        this._movement = [];
        this._movementsDate = [];
    }

    getMovement() {
        return this._movement;
    }
    
    deposit(val) {
        this._movement.push(val)
    }

    multideposit(arr) {
        this._movement = [...arr];
    }

    getTotalBalance() {
        return this._movement.reduce((acc, curr)=> acc+=curr,0);
    }

    withdraw(val) {
        let balance = this.getTotalBalance();
        if(balance> val) {
            this.deposit(-val)
        } else {
            return;
        }
    }

    _approveLoan(val) {
        if(val > 0) {
            return true;
        }else {
            return false;
        }
    }

    requestLoan(val) {
        if(this._approveLoan(val)){
            this.deposit(val);
        }
    }

    getTotalWithdrawl () {
        return this._movement.filter(mov => mov < 0).reduce((acc, cur)=> acc+=cur,0);
    }

    getTotalDeposit () {
        return this.getMovement().filter(mov => mov > 0).reduce((acc, curr) => acc+=curr,0);
    }

    setPin(pin) {
        this._pin = pin; 
    }

    setSingleMovementDate() {
        const date = new Date();
        this._movementsDate.push(date.toISOString());
    }

    setMultipleMovementDate(arr) {
        this._movementsDate = [...arr]; 
    }

    getMovementDate() {
        return this._movementsDate;
    }

    setInterestRate(val) {
        this._interestRate = val;
    }

    getTotalInterest() {
        return Math.round(this.getTotalDeposit() * (this._interestRate / 100));
    }

    genUserName() {
        this.userName = this.owner.toLowerCase()
                                .split(' ')
                                .map(word=>word[0])
                                .join('')

    }

    getSortedMovement = function() {
        return [...this._movement].sort((a,b) => a - b);
    }
    
    checkPin(val) {
        if(val === this._pin) {
            return true;
        }
        else {
            return false;
        }
    }
}

const account1 = new Account()
account1.owner = 'Jonas Schmedtmann';
account1.multideposit([200, 450, -400, 3000, -650, -130, 70, 1300])
account1.setMultipleMovementDate(
    [
        '2019-11-30T09:48:16.867Z',
        '2019-12-25T06:04:23.907Z',
        '2020-01-25T14:18:46.235Z',
        '2020-02-05T16:33:06.386Z',
        '2020-04-10T14:43:26.374Z',
        '2020-06-25T18:49:59.371Z',
        '2020-07-26T12:01:20.894Z',
        '2021-03-01T13:15:33.035Z',
      ]
)
account1.setInterestRate(10);
account1.setPin(1111);

const account2 = new Account()
account2.owner = 'Siddharth Malviya';
account2.setInterestRate(7);
account2.multideposit([5000, 3400, -150, -790, -3210, -1000, 8500, -30])
account2.setMultipleMovementDate(
    [
        '2019-11-18T21:31:17.178Z',
        '2019-12-23T07:42:02.383Z',
        '2020-01-28T09:15:04.904Z',
        '2020-04-01T10:17:24.185Z',
        '2020-05-08T14:11:59.604Z',
        '2020-05-27T17:01:17.194Z',
        '2020-07-11T23:36:17.929Z',
        '2020-07-12T10:51:36.790Z',
      ]
)
account2.setPin(2222);

const accounts = [account1, account2]; 


// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');




// Updating UI function 

const updateUI = ()=> {
    displayMovement(currentAccount);
    labelBalance.textContent = `${currentAccount.getTotalBalance()} INR`;
    labelSumIn.textContent = `${currentAccount.getTotalDeposit()} INR`;
    labelSumOut.textContent = `${currentAccount.getTotalWithdrawl()} INR`;
    labelSumInterest.textContent = `${currentAccount.getTotalInterest()} INR`
}


// generating Usernames
const genAllUserName = accounts.forEach(acc => {
    acc.genUserName();
})


// formating movement dates

const formatMovementDate = function(date) {

    const calcDaysPast = (date1, date2) => Math.round(Math.abs((date2-date1) /(1000 * 60 * 60 * 24)));
  
    const daysPassed = calcDaysPast(new Date(), date);
    console.log(daysPassed)
    if(daysPassed === 0) return 'Today';
    if(daysPassed === 1) return 'Yesterday';
    if(daysPassed <= 7) return `${daysPassed} days ago`;
    else{
      const day = `${date.getDate()}`.padStart(2, 0);
      const month = `${date.getMonth() + 1}`.padStart(2, 0);
      const year = date.getFullYear();
      
      return `${day}/${month}/${year}`
    };
   
  }


// Login System
btnLogin.addEventListener('click', function(e) {
    e.preventDefault();

    currentAccount = accounts.find(acc => acc.userName === inputLoginUsername.value);
    if(currentAccount.checkPin(Number(inputLoginPin.value))) {
        // Display UI and message

        labelWelcome.textContent = `Welcome Back, ${currentAccount.owner}`;
        containerApp.style.opacity = 100;
    }

    inputLoginUsername.value = inputLoginPin.value = "";
    inputLoginPin.blur(); // This function removes the cursor blinking from the input fieled

    updateUI();
    
    if(timer) clearInterval(timer);
    timer = startLogoutTimer();
})


// Logout Timer

const startLogoutTimer = function() {

    const tick = function(){
      // In each call print the remaining time to UI
      const min = String(Math.trunc(time / 60)).padStart(2,0);
      const sec = String(time % 60).padStart(2,0);
  
      labelTimer.textContent = `${min}: ${sec}`;
  
     
      console.log(time)
      if(time == 0) {
        clearInterval(timer);
        labelWelcome.textContent = 'Log in to get Started';
        containerApp.style.opacity = 0;
      }
  
       // Decrease 1s
       time--;
    }
     // set time to 5 minutes
  let time = 30;
  // call the timer every second
  tick();
  const timer = setInterval(tick, 1000)
  
  return timer;
}


// display Movements

const displayMovement = function(currentAccount, sort = false) {
    containerMovements.innerHTML = '';
    const movs = sort ?  currentAccount.getSortedMovement() : currentAccount.getMovement();
    movs.forEach(function(mov, i) {
        const date = new Date(currentAccount.getMovementDate()[i])
    const displayDate = formatMovementDate(date);
        const type = mov>0 ? 'deposit':'withdrawal';

        const html = `<div class="movements__row">
                        <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
                        <div class="movements__date">${displayDate}</div>
                        <div class="movements__value">${mov}</div>
                        </div>`;

        containerMovements.insertAdjacentHTML('afterbegin', html);                
    })
}

// Display total balance




// sort button handler

let sorted = false;
btnSort.addEventListener('click', (e) => {
    e.preventDefault();
    displayMovement(currentAccount,sorted)
    sorted = !sorted;
})

// console.log(currentAccount);

// handle transfer

btnTransfer.addEventListener('click', function(e) {
    e.preventDefault();
    console.log('Button Clicked')
    const amount = Number(inputTransferAmount.value);
    const receiver = accounts.find(acc => acc.userName === inputTransferTo.value)
    // console.log(receiver)
    const totalBalance = currentAccount.getTotalBalance();
    // console.log(totalBalance)
    if(receiver && amount > 0 && amount <= totalBalance && receiver !== currentAccount.userName) {
        receiver.deposit(amount);
        currentAccount.withdraw(amount);
        inputTransferTo.value = inputTransferAmount.value = ''
        currentAccount.setSingleMovementDate();
        receiver.setSingleMovementDate();
    }else{
        console.log('Invalid transfer')
    }

    updateUI();
    clearInterval(timer);
    timer = startLogoutTimer();

})

// Handling loan 
btnLoan.addEventListener('click', function(e) {
    e.preventDefault();
    const loanAmt = Number(inputLoanAmount.value);
    currentAccount.requestLoan(loanAmt);
    setTimeout(()=> {
        updateUI()
    }, 2000)
    inputLoanAmount.value = '';
    inputLoanAmount.blur();
    clearInterval(timer);
    timer = startLogoutTimer();
})

