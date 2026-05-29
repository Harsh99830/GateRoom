const EventEmitter = require('events');

const names = [
  "Aarav", "Vihaan", "Aditya", "Arjun", "Sai", "Ayaan", "Krishna", "Ishaan", "Shaurya", "Atharv", "Ananya", "Diya", "Suhana", "Kriti", "Priya", "Neha", "Riya", "Aisha", "Aditi", "Pooja", "Rohan", "Kabir", "Dhruv", "Rishi", "Yash", "Kartik", "Karan", "Gaurav", "Nikhil", "Pranav", "Sneha", "Kavya", "Megha", "Nidhi", "Swati", "Tanya", "Rachita", "Ritika", "Simran", "Anjali", "Varun", "Abhinav", "Akash", "Rahul", "Rohit", "Sachin", "Saurabh", "Vishal", "Amit", "Manish",
  "Abhishek", "Ravi", "Prakash", "Sanjay", "Rajesh", "Sunil", "Anil", "Manoj", "Ajay", "Vijay", "Pankaj", "Deepak", "Rakesh", "Sandeep", "Surya", "Rajat", "Alok", "Vikas", "Ashish", "Mohit", "Tarun", "Nitin", "Prateek", "Siddharth", "Gautam", "Sumit", "Puneet", "Mayank", "Rishabh", "Vaibhav", "Harsh", "Chirag", "Jatin", "Kunal", "Lakshya", "Madhav", "Nakul", "Ojas", "Parth", "Raghav", "Samar", "Tushar", "Ujjwal", "Vedant", "Aryan", "Bhavik", "Chetan", "Darshan", "Eshaan", "Farhan",
  "Girish", "Himanshu", "Ishan", "Jay", "Keshav", "Lalit", "Mukesh", "Navin", "Om", "Piyush", "Qasim", "Raman", "Shiva", "Tejas", "Utkarsh", "Vidur", "Yug", "Zayed", "Anita", "Bhoomika", "Charu", "Devika", "Esha", "Falguni", "Gauri", "Heena", "Isha", "Jaya", "Kajal", "Lata", "Mamta", "Nandini", "Ojaswini", "Pallavi", "Roshni", "Sakshi", "Trisha", "Uma", "Vidya", "Yamini", "Zara", "Aakash", "Bhavesh", "Chandan", "Dinesh", "Eklavya", "Gagan", "Hemant", "Inder", "Jignesh",
  "Kapil", "Lokesh", "Nishant", "Omkar", "Prashant", "Rajiv", "Sagar", "Uday", "Vineet", "Yatin", "Zubin", "Aarti", "Bhavna", "Chhavi", "Disha", "Ekta", "Gargi", "Harshita", "Ishita", "Jyoti", "Kiran", "Leela", "Meera", "Namrata", "Omi", "Poonam", "Rani", "Sushma", "Urmila", "Vandana", "Yashoda", "Zoya"
];
const branches = ['CSE', 'ECE', 'ME', 'CE', 'EE', 'IN'];

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

class BotEngine extends EventEmitter {
  constructor() {
    super();
    this.bots = [];
    this.realUserCount = 0;
    this.currentTarget = 0;
    this.lastDay = new Date().getDate();
    this.initBots();
    this.startEngine();
  }

  initBots() {
    // Generate 160 bots
    let usedNames = new Set();
    let usedMinutes = new Set();
    
    for (let i = 0; i < 160; i++) {
      let name = names[getRandomInt(0, names.length - 1)];
      while (usedNames.has(name)) {
        name = names[getRandomInt(0, names.length - 1)];
      }
      usedNames.add(name);

      let m = getRandomInt(0, 500);
      while(usedMinutes.has(m)) {
        m = getRandomInt(0, 500);
      }
      usedMinutes.add(m);

      this.bots.push({
        id: `bot_${i}`,
        name: name,
        branch: branches[getRandomInt(0, branches.length - 1)],
        todayMinutes: m,
        streak: getRandomInt(1, 30),
        isBot: true,
        isActive: false,
        nextIncrement: Date.now() + getRandomInt(58000, 62000)
      });
    }
  }

  setRealUserCount(count) {
    this.realUserCount = count;
  }

  updateTarget() {
    const now = new Date();
    const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
    const ist = new Date(utc + (3600000 * 5.5));
    const hour = ist.getHours();
    const day = ist.getDay();

    // Check for daily streak reset
    const currentDay = ist.getDate();
    if (this.lastDay !== currentDay) {
      this.lastDay = currentDay;
      let usedMinutes = new Set();
      this.bots.forEach(bot => {
        let m = getRandomInt(0, 50);
        while(usedMinutes.has(m)) { m = getRandomInt(0, 200); }
        usedMinutes.add(m);
        bot.todayMinutes = m;

        if (Math.random() < 0.1) {
          bot.streak = 0;
        } else {
          bot.streak += 1;
        }
      });
    }

    let percent = 0.3; // Default 30%
    if (hour >= 20 && hour <= 23) {
      percent = 0.7; // Peak
    } else if (hour >= 3 && hour <= 6) {
      percent = 0.08; // Low
    }
    
    if (day === 0 || day === 6) {
      percent = Math.min(1.0, percent * 1.2);
    }
    
    // Fluctuate +-3 every 5 mins
    const mins = ist.getMinutes();
    const cycle = Math.floor(mins / 5);
    const fluctuation = (cycle % 7) - 3; 
    
    let target = Math.floor(this.bots.length * percent) + fluctuation;
    
    // Never show exact round numbers
    if (target % 10 === 0) target += 1;
    if (target < 0) target = 1;
    if (target > this.bots.length) target = this.bots.length;
    
    this.currentTarget = target;
  }

  startEngine() {
    setInterval(() => {
      this.tick();
    }, 1000); // Check every second for extreme realism
  }

  tick() {
    const now = Date.now();
    this.updateTarget();

    let currentlyActive = this.bots.filter(b => b.isActive);
    
    // Session protection: If real users > 200, reduce bots
    let adjustedTarget = this.currentTarget;
    if (this.realUserCount > 200) {
      let ratio = 1 - ((this.realUserCount - 200) / 200);
      if (ratio < 0) ratio = 0;
      adjustedTarget = Math.floor(adjustedTarget * ratio);
    }

    // Ensure branch counts add up to total naturally by activating/deactivating 1 by 1
    if (currentlyActive.length < adjustedTarget) {
      let inactive = this.bots.filter(b => !b.isActive);
      if (inactive.length > 0) {
        let b = inactive[getRandomInt(0, inactive.length - 1)];
        b.isActive = true;
        this.emit('bot-joined', b);
        currentlyActive.push(b);
      }
    } else if (currentlyActive.length > adjustedTarget) {
      let b = currentlyActive[getRandomInt(0, currentlyActive.length - 1)];
      b.isActive = false;
      this.emit('bot-away', b);
      currentlyActive = currentlyActive.filter(x => x !== b);
    }

    // Random increments (58-62s) and uniqueness
    currentlyActive.forEach(bot => {
       if (now >= bot.nextIncrement) {
          let nextVal = bot.todayMinutes + 1;
          while (this.bots.some(b => b.id !== bot.id && b.todayMinutes === nextVal)) {
            nextVal += 1;
          }
          bot.todayMinutes = nextVal;
          bot.nextIncrement = now + getRandomInt(58000, 62000);
       }
    });
  }

  getActiveBots() {
    return this.bots
      .filter(bot => bot.isActive)
      .map(({ isBot, isActive, nextIncrement, ...publicData }) => publicData);
  }
}

module.exports = new BotEngine();
