// Exercise 1 - ES6 rewrite

const greeter = (myArray, counter) => {
  const greetText = 'Hello';

  let i = 0;
  for (const name of myArray) {
    if (i >= counter) break; 
    console.log(`${greetText} ${name}`);
    i++;
  }
};

greeter(['omis','emilio','cawn'], 3);

// Exercise 2 - Capitalize first letter using destructuring & spread

const capitalize = (str = "") => {
  if (!str) return "";
  const [first, ...rest] = str;    
  return first.toUpperCase() + rest.join(""); 
};

console.log(capitalize('fooBar')); 
console.log(capitalize('nodeJs'));  

// Exercise 3 - use .map to capitalize each color
const colors = ['red', 'green', 'blue'];

const capitalizedColors = colors.map(color => capitalize(color));

console.log(capitalizedColors);

// Exercise 4 - filter values less than 20

const values = [1, 60, 34, 30, 20, 5];

const filterLessThan20 = values.filter(num => num < 20);

console.log(filterLessThan20);

// Exercise 5 - calculate sum and product with reduce

const array = [1, 2, 3, 4];

const calculateSum = array.reduce((acc, num) => acc + num, 0);

const calculateProduct = array.reduce((acc, num) => acc * num, 1);

console.log(calculateSum); 
console.log(calculateProduct); 

// Exercise 6 - Car class and Sedan subclass

class Car {
  constructor(model, year) {
    this.model = model;
    this.year = year;
  }

  details() {
    return `Model: ${this.model} Engine ${this.year}`;
  }
}

class Sedan extends Car {
  constructor(model, year, balance) {
    super(model, year); 
    this.balance = balance;
  }

  info() {
    return `${this.model} SD has a balance of $${this.balance.toFixed(2)}`;
  }
}


const car2 = new Car('Pontiac Firebird', 1976);
console.log(car2.details());


const sedan = new Sedan('Volvo SD', 2018, 30000);
console.log(sedan.info());

