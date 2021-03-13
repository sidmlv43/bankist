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

    setMovementdate(arr) {
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
account1.setInterestRate(10);
account1.setPin(1111);

const account2 = new Account()
account2.owner = 'Jessica Davis';
account2.setInterestRate(7);
account2.multideposit([5000, 3400, -150, -790, -3210, -1000, 8500, -30])
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
    
    
})

// display Movements

const displayMovement = function(currentAccount, sort = false) {
    containerMovements.innerHTML = '';
    const movs = sort ?  currentAccount.getSortedMovement() : currentAccount.getMovement();

    movs.forEach(function(mov, i) {
        const type = mov>0 ? 'deposit':'withdrawal';
        const html = `<div class="movements__row">
                        <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
                        <div class="movements__date">3 days ago</div>
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
    }else{
        console.log('Invalid transfer')
    }

    updateUI();

})

// Handling loan 
btnLoan.addEventListener('click', function(e) {
    e.preventDefault();
    const loanAmt = Number(inputLoanAmount.value);
    currentAccount.requestLoan(loanAmt);
    setTimeout(()=> {
        updateUI()
        inputLoanAmount.value = '';
        inputLoanAmount.blur();
    }, 2000)
})

