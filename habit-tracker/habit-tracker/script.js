// Select elements
const habitInput = document.getElementById('habitInput');
const timeInput = document.getElementById('timeInput');
const addHabitBtn = document.getElementById('addHabitBtn');
const habitList = document.getElementById('habitList');
const quoteDisplay = document.getElementById('quote');

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// Motivational quotes
const quotes = [
    "Consistency is key to success.",
    "Small habits make a big difference.",
    "Success is the sum of small efforts repeated day in and day out.",
    "The journey of a thousand miles begins with one step.",
    "It's not about having time, it's about making time."
];

// Load habits from local storage on page load
window.onload = function() {
    const savedHabits = JSON.parse(localStorage.getItem('habits')) || [];
    savedHabits.forEach((habit) => {
        addHabitToDOM(habit.text, habit.time, habit.week);
    });
    displayRandomQuote();
};

// Add habit event listener
addHabitBtn.addEventListener('click', () => {
    const habitText = habitInput.value.trim();
    const habitTime = timeInput.value.trim();

    if (habitText && habitTime) {
        const week = Array(7).fill(false);
        addHabitToDOM(habitText, habitTime, week);
        saveHabit(habitText, habitTime, week);
        habitInput.value = '';
        timeInput.value = '';
    }
});

// Function to add a habit to the DOM
function addHabitToDOM(habitText, habitTime, week = Array(7).fill(false)) {
    const li = document.createElement('li');
    li.className = 'habit-item';
    
    // Delete button
    const delBtn = document.createElement('button');
    delBtn.className = 'delete-btn';
    delBtn.textContent = 'Delete';
    delBtn.addEventListener('click', () => {
        if (confirm("Are you sure you want to delete this habit?")) {
            li.remove();
            deleteHabit(habitText);
        }
    });
    li.appendChild(delBtn);

    // Habit name and time
    const span = document.createElement('span');
    span.textContent = `${habitText} (${habitTime} min)`;
    li.appendChild(span);

    // Day checkboxes
    const daysDiv = document.createElement('div');
    daysDiv.className = 'days-checkboxes';
    week.forEach((checked, i) => {
        const label = document.createElement('label');
        label.style.marginRight = '4px';
        const cb = document.createElement('input');
        cb.type = 'checkbox';
        cb.checked = checked;
        cb.dataset.day = i;
        cb.addEventListener('change', () => {
            updateHabitDay(habitText, i, cb.checked);
            updateStreakDisplay();
        });
        label.appendChild(cb);
        label.appendChild(document.createTextNode(daysOfWeek[i][0]));
        daysDiv.appendChild(label);
    });
    li.appendChild(daysDiv);

    // Streak display
    const streakSpan = document.createElement('span');
    streakSpan.className = 'streak';
    streakSpan.style.marginLeft = '10px';
    li.appendChild(streakSpan);

    habitList.appendChild(li);

    // Initial streak display
    function updateStreakDisplay() {
        const streak = calculateStreak(week);
        streakSpan.textContent = `Streak: ${streak}`;
    }
    updateStreakDisplay();
}

// Save habit to local storage
function saveHabit(text, time, week) {
    const habits = JSON.parse(localStorage.getItem('habits')) || [];
    habits.push({ text, time, week });
    localStorage.setItem('habits', JSON.stringify(habits));
}

// Update a specific day's completion for a habit
function updateHabitDay(habitText, dayIndex, checked) {
    const habits = JSON.parse(localStorage.getItem('habits')) || [];
    const habit = habits.find((h) => h.text === habitText);
    if (habit) {
        habit.week[dayIndex] = checked;
        localStorage.setItem('habits', JSON.stringify(habits));
        // Update DOM streak
        refreshHabits();
    }
}

// Delete habit from local storage
function deleteHabit(habitText) {
    let habits = JSON.parse(localStorage.getItem('habits')) || [];
    habits = habits.filter((h) => h.text !== habitText);
    localStorage.setItem('habits', JSON.stringify(habits));
}

// Calculate the current streak for the week (consecutive trues)
function calculateStreak(week) {
    let maxStreak = 0, currentStreak = 0;
    for (let i = 0; i < week.length; i++) {
        if (week[i]) {
            currentStreak++;
            maxStreak = Math.max(maxStreak, currentStreak);
        } else {
            currentStreak = 0;
        }
    }
    return maxStreak;
}

// Refresh the habit list in the DOM
function refreshHabits() {
    habitList.innerHTML = '';
    const habits = JSON.parse(localStorage.getItem('habits')) || [];
    habits.forEach((habit) => {
        addHabitToDOM(habit.text, habit.time, habit.week);
    });
}

// Display a random quote
function displayRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    quoteDisplay.textContent = quotes[randomIndex];
}
