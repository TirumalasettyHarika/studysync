/* =========================================
   STUDYSYNC JAVASCRIPT
========================================= */


/* =========================================
   TASK MANAGEMENT
========================================= */

let tasks =
    JSON.parse(
        localStorage.getItem("studySyncTasks")
    ) || [];

const taskInput =
    document.getElementById("taskInput");

const taskList =
    document.getElementById("taskList");

let selectedPriority = "medium";


function saveTasks() {

    localStorage.setItem(
        "studySyncTasks",
        JSON.stringify(tasks)
    );

}


function togglePriorityMenu() {

    const menu =
        document.getElementById("priorityMenu");

    if (menu) {
        menu.classList.toggle("show");
    }

}


function selectPriority(priority, text) {

    selectedPriority = priority;

    const selected =
        document.getElementById(
            "selectedPriority"
        );

    const menu =
        document.getElementById(
            "priorityMenu"
        );

    if (selected) {
        selected.textContent = text;
    }

    if (menu) {
        menu.classList.remove("show");
    }

}


function addTask() {

    if (!taskInput) return;

    const taskText =
        taskInput.value.trim();

    if (taskText === "") {

        alert("Please enter a task.");

        return;

    }


    tasks.push({

        id: Date.now(),

        text: taskText,

        priority: selectedPriority,

        completed: false

    });


    taskInput.value = "";

    saveTasks();

    renderTasks();

}


function renderTasks() {

    if (!taskList) return;

    taskList.innerHTML = "";


    tasks.forEach(task => {

        const taskItem =
            document.createElement("div");


        taskItem.className =
            `task-item ${
                task.completed ? "completed" : ""
            }`;


        let priorityText;
        let priorityClass;


        if (task.priority === "high") {

            priorityText = "🔴 High";
            priorityClass = "high";

        }

        else if (task.priority === "low") {

            priorityText = "🟢 Low";
            priorityClass = "low";

        }

        else {

            priorityText = "🟡 Medium";
            priorityClass = "medium";

        }


        taskItem.innerHTML = `

            <div class="task-left">

                <input
                    type="checkbox"
                    ${
                        task.completed
                            ? "checked"
                            : ""
                    }
                    onchange="toggleTask(${task.id})"
                >

                <span class="task-text">
                    ${task.text}
                </span>

            </div>


            <div class="task-right">

                <span
                    class="priority-badge ${priorityClass}"
                >
                    ${priorityText}
                </span>


                <button
                    class="delete-btn"
                    onclick="deleteTask(${task.id})"
                >
                    🗑️
                    
                </button>

            </div>

        `;


        taskList.appendChild(taskItem);

    });


    updateStats();

}


function toggleTask(id) {

    tasks =
        tasks.map(task => {

            if (task.id === id) {

                task.completed =
                    !task.completed;
                    recordStudyActivity();

            }

            return task;

        });


    saveTasks();

    renderTasks();

}


function deleteTask(id) {

    tasks =
        tasks.filter(
            task => task.id !== id
        );


    saveTasks();

    renderTasks();

}


/* =========================================
   TASK STATISTICS
========================================= */

function updateStats() {

    const totalTasks =
        tasks.length;


    const completedTasks =
        tasks.filter(
            task => task.completed
        ).length;


    let percentage = 0;


    if (totalTasks > 0) {

        percentage =
            Math.round(
                (completedTasks / totalTasks) * 100
            );

    }


    const taskCount =
        document.getElementById(
            "taskCount"
        );

    const completedCount =
        document.getElementById(
            "completedCount"
        );

    const progressPercent =
        document.getElementById(
            "progressPercent"
        );


    if (taskCount) {

        taskCount.textContent =
            totalTasks;

    }


    if (completedCount) {

        completedCount.textContent =
            completedTasks;

    }


    if (progressPercent) {

        progressPercent.textContent =
            percentage + "%";

    }

}


/* =========================================
   ENTER KEY
========================================= */

if (taskInput) {

    taskInput.addEventListener(
        "keydown",
        event => {

            if (event.key === "Enter") {

                addTask();

            }

        }
    );

}


/* =========================================
   CLOSE PRIORITY MENU
========================================= */

document.addEventListener(
    "click",
    event => {

        const prioritySelect =
            document.getElementById(
                "prioritySelect"
            );

        const priorityMenu =
            document.getElementById(
                "priorityMenu"
            );


        if (
            prioritySelect &&
            priorityMenu &&
            !prioritySelect.contains(
                event.target
            )
        ) {

            priorityMenu.classList.remove(
                "show"
            );

        }

    }
);


/* =========================================
   FOCUS TIMER
========================================= */

let selectedMinutes = 25;

let timerSeconds =
    selectedMinutes * 60;

let timerInterval = null;

let timerRunning = false;


function updateTimerDisplay() {

    const display =
        document.getElementById(
            "timerDisplay"
        );


    if (!display) return;


    const minutes =
        Math.floor(
            timerSeconds / 60
        );


    const seconds =
        timerSeconds % 60;


    const formattedMinutes =
        String(minutes).padStart(
            2,
            "0"
        );


    const formattedSeconds =
        String(seconds).padStart(
            2,
            "0"
        );


    display.textContent =
        `${formattedMinutes}:${formattedSeconds}`;


    updateTimerRing();

}


function updateTimerRing() {

    const ring =
        document.querySelector(
            ".timer-ring"
        );


    if (!ring) return;


    const totalSeconds =
        selectedMinutes * 60;


    const progress =
        timerSeconds / totalSeconds;


    const degrees =
        progress * 360;


    ring.style.background = `

        conic-gradient(

            #55ddd4 0deg,

            #55ddd4 ${degrees}deg,

            #182b32 ${degrees}deg,

            #182b32 360deg

        )

    `;

}


function startTimer() {

    if (timerRunning) return;


    if (timerSeconds <= 0) {

        timerSeconds =
            selectedMinutes * 60;

        updateTimerDisplay();

    }


    timerRunning = true;


    timerInterval =
        setInterval(() => {

            if (timerSeconds > 0) {

                timerSeconds--;

                updateTimerDisplay();

            }

            else {

                clearInterval(
                    timerInterval
                );

                timerRunning = false;

                alert(
                    "🎉 Focus session completed!"
                );

            }

        }, 1000);

}


function pauseTimer() {

    clearInterval(
        timerInterval
    );

    timerRunning = false;

}


function resetTimer() {

    clearInterval(
        timerInterval
    );

    timerRunning = false;

    timerSeconds =
        selectedMinutes * 60;

    updateTimerDisplay();

}


function setTimer(minutes) {

    clearInterval(
        timerInterval
    );

    timerRunning = false;

    selectedMinutes =
        minutes;

    timerSeconds =
        minutes * 60;

    updateTimerDisplay();

}


function customTimer() {

    const minutes =
        prompt(
            "Enter focus time in minutes:"
        );


    if (minutes === null) return;


    const value =
        Number(minutes);


    if (
        !Number.isInteger(value) ||
        value <= 0
    ) {

        alert(
            "Please enter a valid number."
        );

        return;

    }


    setTimer(value);

}


/* =========================================
   THEME
========================================= */

const themeToggle =
    document.getElementById(
        "themeToggle"
    );


if (themeToggle) {

    themeToggle.addEventListener(
        "click",
        () => {

            document.body.classList.toggle(
                "dark"
            );


            if (
                document.body.classList.contains(
                    "dark"
                )
            ) {

                themeToggle.textContent =
                    "☀️ Light Mode";


                localStorage.setItem(
                    "studySyncTheme",
                    "dark"
                );

            }

            else {

                themeToggle.textContent =
                    "🌙 Dark Mode";


                localStorage.setItem(
                    "studySyncTheme",
                    "light"
                );

            }

        }
    );

}


const savedTheme =
    localStorage.getItem(
        "studySyncTheme"
    );


if (
    savedTheme === "dark" &&
    themeToggle
) {

    document.body.classList.add(
        "dark"
    );

    themeToggle.textContent =
        "☀️ Light Mode";

}


/* =========================================
   SCROLL TO TASKS
========================================= */

function scrollToTasks() {

    const tasksSection =
        document.getElementById(
            "tasks"
        );


    if (tasksSection) {

        tasksSection.scrollIntoView({
            behavior: "smooth"
        });

    }

}


/* =========================================
   STUDY SCHEDULE
========================================= */

const defaultSchedules = [

    {
        id: "c-programming",
        subject: "C Programming",
        day: "Monday",
        time: "18:00:00",
        icon: "💻"
    },

    {
        id: "mathematics",
        subject: "Mathematics",
        day: "Tuesday",
        time: "18:00:00",
        icon: "📐"
    },

    {
        id: "digital-logic",
        subject: "Digital Logic",
        day: "Wednesday",
        time: "18:00:00",
        icon: "🔌"
    },

    {
        id: "computer-organization",
        subject: "Computer Organization",
        day: "Thursday",
        time: "18:00:00",
        icon: "🖥️"
    },

    {
        id: "web-development",
        subject: "Web Development",
        day: "Friday",
        time: "18:00:00",
        icon: "🌐"
    },

    {
        id: "data-structures",
        subject: "Data Structures",
        day: "Saturday",
        time: "10:00:00",
        icon: "📊"
    }

];


let schedules =
    JSON.parse(
        localStorage.getItem(
            "studySyncSchedules"
        )
    );


if (!Array.isArray(schedules)) {

    schedules =
        [...defaultSchedules];

    localStorage.setItem(
        "studySyncSchedules",
        JSON.stringify(schedules)
    );

}


function saveSchedules() {

    localStorage.setItem(
        "studySyncSchedules",
        JSON.stringify(schedules)
    );

}


function formatScheduleTime(time) {

    const [
        hour,
        minute,
        second = "00"
    ] = time.split(":");


    let hours =
        Number(hour);


    const period =
        hours >= 12
            ? "PM"
            : "AM";


    hours =
        hours % 12 || 12;


    return `${hours}:${minute}:${second} ${period}`;

}


function renderSchedules() {

    const list =
        document.getElementById(
            "scheduleList"
        );


    if (!list) return;


    list.innerHTML = "";


    schedules.forEach(schedule => {

        const card =
            document.createElement(
                "div"
            );


        card.className =
            "schedule-card";


        card.innerHTML = `

            <div class="schedule-card-top">

                <span class="schedule-day">

                    ${schedule.day.toUpperCase()}

                </span>


                <button
                    type="button"
                    class="schedule-delete"
                    onclick="deleteSchedule('${schedule.id}')"
                >
                    🗑️
                </button>

            </div>


            <h3>

                ${schedule.icon}

                ${schedule.subject}

            </h3>


            <p>

                ⏰ ${formatScheduleTime(
                    schedule.time
                )}

            </p>

        `;


        list.appendChild(card);

    });

}


function openScheduleForm() {

    const form =
        document.getElementById(
            "scheduleForm"
        );


    if (form) {

        form.style.display =
            "block";

    }

}


function closeScheduleForm() {

    const form =
        document.getElementById(
            "scheduleForm"
        );


    if (form) {

        form.style.display =
            "none";

    }


    const subject =
        document.getElementById(
            "customSubject"
        );


    const time =
        document.getElementById(
            "customTime"
        );


    if (subject) subject.value = "";

    if (time) time.value = "";

}


function addCustomSchedule() {

    const subjectInput =
        document.getElementById(
            "customSubject"
        );

    const dayInput =
        document.getElementById(
            "customDay"
        );

    const timeInput =
        document.getElementById(
            "customTime"
        );


    if (
        !subjectInput ||
        !dayInput ||
        !timeInput
    ) return;


    const subject =
        subjectInput.value.trim();

    const day =
        dayInput.value;

    const time =
        timeInput.value;


    if (subject === "") {

        alert(
            "Please enter a subject."
        );

        return;

    }


    if (time === "") {

        alert(
            "Please select a time."
        );

        return;

    }


    schedules.push({

        id:
            "custom-" +
            Date.now(),

        subject: subject,

        day: day,

        time: time,

        icon: "📚"

    });


    saveSchedules();

    renderSchedules();

    closeScheduleForm();

}


function deleteSchedule(id) {

    const confirmed =
        confirm(
            "Delete this schedule?"
        );


    if (!confirmed) return;


    schedules =
        schedules.filter(
            schedule =>
                schedule.id !== id
        );


    saveSchedules();

    renderSchedules();

}


/* =========================================
   STUDY PROGRESS — TOPIC TRACKER
========================================= */

let studyProgress =
    JSON.parse(
        localStorage.getItem(
            "studySyncProgress"
        )
    ) || [];


/*
   Remove old manual-progress data
   if it does not match the new format.
*/

studyProgress =
    studyProgress.filter(
        subject =>
            subject &&
            typeof subject.subject === "string" &&
            Number.isInteger(
                subject.totalTopics
            ) &&
            Array.isArray(
                subject.topics
            )
    );


function saveProgress() {

    localStorage.setItem(
        "studySyncProgress",
        JSON.stringify(
            studyProgress
        )
    );

}


function addSubjectProgress() {

    const subjectInput =
        document.getElementById(
            "progressSubject"
        );


    const totalInput =
        document.getElementById(
            "totalTopics"
        );


    if (
        !subjectInput ||
        !totalInput
    ) return;


    const subject =
        subjectInput.value.trim();


    const totalTopics =
        Number(
            totalInput.value
        );


    if (subject === "") {

        alert(
            "Please enter a subject."
        );

        return;

    }


    if (
        !Number.isInteger(
            totalTopics
        ) ||
        totalTopics <= 0
    ) {

        alert(
            "Please enter a valid number of topics."
        );

        return;

    }


    studyProgress.push({

        id:
            "subject-" +
            Date.now(),

        subject:
            subject,

        totalTopics:
            totalTopics,

        topics: []

    });


    saveProgress();

    renderProgress();


    subjectInput.value = "";

    totalInput.value = "";

}


function renderProgress() {

    const list =
        document.getElementById(
            "progressList"
        );


    if (!list) return;


    list.innerHTML = "";


    if (
        studyProgress.length === 0
    ) {

        list.innerHTML = `

            <div class="empty-progress">

                <span>📚</span>

                <p>
                    No subjects added yet.
                </p>

                <small>
                    Add a subject to start tracking your progress.
                </small>

            </div>

        `;

        return;

    }


    studyProgress.forEach(
        subject => {

            const completed =
                subject.topics.filter(
                    topic =>
                        topic.completed
                ).length;


            const percentage =
                Math.round(
                    (
                        completed /
                        subject.totalTopics
                    ) * 100
                );


            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "progress-card";


            card.innerHTML = `

                <div class="progress-card-top">

                    <h3>
                        📚 ${subject.subject}
                    </h3>

                    <span
                        class="progress-percent"
                    >
                        ${percentage}%
                    </span>

                </div>


                <p class="topic-count">

                    ${completed} /
                    ${subject.totalTopics}
                    Topics Completed

                </p>


                <div class="progress-bar">

                    <div
                        class="progress-fill"
                        style="width: ${percentage}%"
                    ></div>

                </div>


                <div class="topic-add-box">

                    <input
                        type="text"
                        id="topic-${subject.id}"
                        placeholder="Enter topic..."
                    >


                    <button
                        type="button"
                        onclick="addTopic('${subject.id}')"
                    >
                        + Add Topic
                    </button>

                </div>


                <div class="topic-list">

                    ${
                        subject.topics.length === 0

                        ? `

                            <p class="no-topics">
                                No topics added yet.
                            </p>

                        `

                        :

                        subject.topics
                            .map(
                                topic => `

                                    <div class="topic-item">

                                        <label>

                                            <input
                                                type="checkbox"
                                                ${
                                                    topic.completed
                                                        ? "checked"
                                                        : ""
                                                }
                                                onchange="toggleTopic(
                                                    '${subject.id}',
                                                    '${topic.id}'
                                                )"
                                            >

                                            <span
                                                class="${
                                                    topic.completed
                                                        ? "topic-completed"
                                                        : ""
                                                }"
                                            >
                                                ${topic.name}
                                            </span>

                                        </label>


                                        <button
                                            type="button"
                                            onclick="deleteTopic(
                                                '${subject.id}',
                                                '${topic.id}'
                                            )"
                                        >
                                            🗑️
                                        </button>

                                    </div>

                                `
                            )
                            .join("")
                    }

                </div>


                <button
                    type="button"
                    class="progress-delete"
                    onclick="deleteProgress('${subject.id}')"
                >
                    🗑️ Delete Subject
                </button>

            `;


            list.appendChild(card);

        }
    );

}


function addTopic(subjectId) {

    const input =
        document.getElementById(
            `topic-${subjectId}`
        );


    if (!input) return;


    const topicName =
        input.value.trim();


    if (topicName === "") {

        alert(
            "Please enter a topic."
        );

        return;

    }


    const subject =
        studyProgress.find(
            item =>
                item.id === subjectId
        );


    if (!subject) return;


    if (
        subject.topics.length >=
        subject.totalTopics
    ) {

        alert(
            "You have already added all the topics for this subject."
        );

        return;

    }


    subject.topics.push({

        id:
            "topic-" +
            Date.now(),

        name:
            topicName,

        completed:
            false

    });


    saveProgress();

    renderProgress();

}


function toggleTopic(
    subjectId,
    topicId
) {

    const subject =
        studyProgress.find(
            item =>
                item.id === subjectId
        );


    if (!subject) return;


    const topic =
        subject.topics.find(
            item =>
                item.id === topicId
        );


    if (!topic) return;


    topic.completed =
        !topic.completed;


    saveProgress();

    renderProgress();

}


function deleteTopic(
    subjectId,
    topicId
) {

    const subject =
        studyProgress.find(
            item =>
                item.id === subjectId
        );


    if (!subject) return;


    subject.topics =
        subject.topics.filter(
            topic =>
                topic.id !== topicId
        );


    saveProgress();

    renderProgress();

}


function deleteProgress(id) {

    const confirmed =
        confirm(
            "Delete this subject and all its topics?"
        );


    if (!confirmed) return;


    studyProgress =
        studyProgress.filter(
            subject =>
                subject.id !== id
        );


    saveProgress();

    renderProgress();

}


/* =========================================
   STUDY NOTES
========================================= */

let studyNotes =
    JSON.parse(
        localStorage.getItem(
            "studySyncNotes"
        )
    ) || [];


function saveNotes() {

    localStorage.setItem(
        "studySyncNotes",
        JSON.stringify(
            studyNotes
        )
    );

}


function addNote() {

    const titleInput =
        document.getElementById(
            "noteTitle"
        );


    const contentInput =
        document.getElementById(
            "noteContent"
        );


    if (
        !titleInput ||
        !contentInput
    ) return;


    const title =
        titleInput.value.trim();


    const content =
        contentInput.value.trim();


    if (title === "") {

        alert(
            "Please enter a note title."
        );

        return;

    }


    if (content === "") {

        alert(
            "Please write something in your note."
        );

        return;

    }


    studyNotes.push({

        id:
            "note-" +
            Date.now(),

        title:
            title,

        content:
            content

    });


    saveNotes();

    renderNotes();


    titleInput.value = "";

    contentInput.value = "";

}


function renderNotes() {

    const list =
        document.getElementById(
            "notesList"
        );


    if (!list) return;


    list.innerHTML = "";


    if (
        studyNotes.length === 0
    ) {

        list.innerHTML = `

            <div class="empty-notes">

                <span>📝</span>

                <p>
                    No notes yet.
                </p>

                <small>
                    Create your first study note.
                </small>

            </div>

        `;

        return;

    }


    studyNotes.forEach(
        note => {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "note-card";


            card.innerHTML = `

                <div class="note-card-top">

                    <h3>
                        📝 ${note.title}
                    </h3>


                    <button
                        type="button"
                        class="note-delete"
                        onclick="deleteNote('${note.id}')"
                    >
                        🗑️
                    </button>

                </div>


                <p class="note-content">

                    ${note.content}

                </p>

            `;


            list.appendChild(card);

        }
    );

}


function deleteNote(id) {

    const confirmed =
        confirm(
            "Delete this note?"
        );


    if (!confirmed) return;


    studyNotes =
        studyNotes.filter(
            note =>
                note.id !== id
        );


    saveNotes();

    renderNotes();

}
/* =========================================
   DAILY STREAKS — NEW SYSTEM
========================================= */

let streakData =
    JSON.parse(
        localStorage.getItem("studySyncStreaks")
    ) || {
        dates: []
    };


/* =========================================
   SAVE STREAK DATA
========================================= */

function saveStreakData() {

    localStorage.setItem(
        "studySyncStreaks",
        JSON.stringify(streakData)
    );

}


/* =========================================
   GET TODAY'S DATE
========================================= */

function getTodayDate() {

    const today = new Date();

    return today.toISOString().split("T")[0];

}


/* =========================================
   RECORD STUDY ACTIVITY
========================================= */

function recordStudyActivity() {

    const today =
        getTodayDate();

    if (
        !streakData.dates.includes(today)
    ) {

        streakData.dates.push(today);

        saveStreakData();

    }

    renderDailyStreaks();

}


/* =========================================
   CALCULATE CURRENT STREAK
========================================= */

function calculateCurrentStreak() {

    if (
        streakData.dates.length === 0
    ) {
        return 0;
    }


    const dates =
        [...new Set(streakData.dates)]
            .sort()
            .reverse();


    const today =
        new Date(getTodayDate());


    const latest =
        new Date(dates[0]);


    const difference =
        Math.floor(
            (
                today - latest
            ) /
            (1000 * 60 * 60 * 24)
        );


    /*
       If the user studied yesterday
       but hasn't studied today yet,
       the streak is still alive.
    */

    if (difference > 1) {
        return 0;
    }


    let streak = 1;


    for (
        let i = 1;
        i < dates.length;
        i++
    ) {

        const current =
            new Date(dates[i - 1]);

        const previous =
            new Date(dates[i]);


        const dayDifference =
            Math.floor(
                (
                    current - previous
                ) /
                (1000 * 60 * 60 * 24)
            );


        if (
            dayDifference === 1
        ) {

            streak++;

        } else {

            break;

        }

    }


    return streak;

}


/* =========================================
   CALCULATE BEST STREAK
========================================= */

function calculateBestStreak() {

    if (
        streakData.dates.length === 0
    ) {
        return 0;
    }


    const dates =
        [...new Set(streakData.dates)]
            .sort();


    let best = 1;
    let current = 1;


    for (
        let i = 1;
        i < dates.length;
        i++
    ) {

        const previous =
            new Date(dates[i - 1]);

        const currentDate =
            new Date(dates[i]);


        const difference =
            Math.floor(
                (
                    currentDate -
                    previous
                ) /
                (1000 * 60 * 60 * 24)
            );


        if (
            difference === 1
        ) {

            current++;

            best =
                Math.max(
                    best,
                    current
                );

        } else {

            current = 1;

        }

    }


    return best;

}


/* =========================================
   RENDER DAILY STREAKS
========================================= */

function renderDailyStreaks() {

    const currentStreak =
        document.getElementById(
            "currentStreak"
        );

    const bestStreak =
        document.getElementById(
            "bestStreak"
        );

    const todayStatus =
        document.getElementById(
            "todayStatus"
        );

    const weeklyStreak =
        document.getElementById(
            "weeklyStreak"
        );

    const weeklyCount =
        document.getElementById(
            "weeklyCount"
        );

    const streakMessage =
        document.getElementById(
            "streakMessage"
        );


    if (
        !currentStreak ||
        !bestStreak ||
        !todayStatus ||
        !weeklyStreak ||
        !weeklyCount
    ) {
        return;
    }


    /* CURRENT */

    const current =
        calculateCurrentStreak();


    currentStreak.textContent =
        current;


    /* BEST */

    const best =
        calculateBestStreak();


    bestStreak.textContent =
        `${best} days`;


    /* TODAY */

    const today =
        getTodayDate();


    const studiedToday =
        streakData.dates.includes(
            today
        );


    if (studiedToday) {

        todayStatus.textContent =
            "Completed";

        todayStatus.style.color =
            "#55ddd4";

        streakMessage.textContent =
            "Great work! You studied today. 🔥";

    } else {

        todayStatus.textContent =
            "Not Started";

        todayStatus.style.color =
            "#71898d";


        if (current > 0) {

            streakMessage.textContent =
                "Study today to keep your streak alive!";

        } else {

            streakMessage.textContent =
                "Start your study journey today.";

        }

    }


    /* =====================================
       LAST 7 DAYS
    ===================================== */

    weeklyStreak.innerHTML = "";


    let activeDays = 0;


    for (
        let i = 6;
        i >= 0;
        i--
    ) {

        const date =
            new Date();


        date.setHours(
            0,
            0,
            0,
            0
        );


        date.setDate(
            date.getDate() - i
        );


        const dateString =
            date.toISOString()
                .split("T")[0];


        const active =
            streakData.dates.includes(
                dateString
            );


        if (active) {
            activeDays++;
        }


        const dayName =
            date.toLocaleDateString(
                "en-US",
                {
                    weekday: "short"
                }
            );


        const dayNumber =
            date.getDate();


        const dayCard =
            document.createElement(
                "div"
            );


        dayCard.className =
            "streak-day";


        if (active) {

            dayCard.classList.add(
                "active"
            );

        }


        if (i === 0) {

            dayCard.classList.add(
                "today"
            );

        }


        dayCard.innerHTML = `

            <span class="streak-day-name">
                ${dayName}
            </span>

            <span class="streak-day-date">
                ${dayNumber}
            </span>

            <span class="streak-day-dot">
                ${active ? "✓" : "·"}
            </span>

        `;


        weeklyStreak.appendChild(
            dayCard
        );

    }


    weeklyCount.textContent =
        `${activeDays} / 7 days`;

}


/* =========================================
   INITIALIZE DAILY STREAKS
========================================= */

renderDailyStreaks();


/* =========================================
   INITIALIZE EVERYTHING
========================================= */

renderTasks();

updateTimerDisplay();

renderSchedules();

saveProgress();

renderProgress();

renderNotes();
/* =========================================
   STUDY ANALYTICS
========================================= */

function renderAnalytics() {

    /* SUBJECTS */

    const subjects =
        Array.isArray(studyProgress)
            ? studyProgress.length
            : 0;


    /* TOPICS */

    let totalTopics = 0;
    let completedTopics = 0;

    if (Array.isArray(studyProgress)) {

        studyProgress.forEach(subject => {

            totalTopics +=
                Number(subject.totalTopics) || 0;

            if (Array.isArray(subject.topics)) {

                completedTopics +=
                    subject.topics.filter(
                        topic => topic.completed
                    ).length;

            }

        });

    }


    /* COMPLETED TASKS */

    const completedTasks =
        Array.isArray(tasks)
            ? tasks.filter(
                task => task.completed
            ).length
            : 0;


    /* CURRENT STREAK */

    const currentStreak =
        typeof calculateCurrentStreak === "function"
            ? calculateCurrentStreak()
            : 0;


    /* OVERALL STUDY PROGRESS */

    let overallProgress = 0;

    if (totalTopics > 0) {

        overallProgress =
            Math.round(
                (completedTopics / totalTopics) * 100
            );

    }


    /* UPDATE CARDS */

    const subjectsElement =
        document.getElementById(
            "analyticsSubjects"
        );

    const topicsElement =
        document.getElementById(
            "analyticsTopics"
        );

    const tasksElement =
        document.getElementById(
            "analyticsTasks"
        );

    const streakElement =
        document.getElementById(
            "analyticsStreak"
        );

    const progressElement =
        document.getElementById(
            "analyticsProgress"
        );

    const progressFill =
        document.getElementById(
            "analyticsProgressFill"
        );


    if (subjectsElement) {
        subjectsElement.textContent =
            subjects;
    }

    if (topicsElement) {
        topicsElement.textContent =
            completedTopics;
    }

    if (tasksElement) {
        tasksElement.textContent =
            completedTasks;
    }

    if (streakElement) {
        streakElement.textContent =
            `${currentStreak} days`;
    }

    if (progressElement) {
        progressElement.textContent =
            `${overallProgress}%`;
    }

    if (progressFill) {
        progressFill.style.width =
            `${overallProgress}%`;
    }

}


/* =========================================
   UPDATE ANALYTICS AUTOMATICALLY
========================================= */

function updateAllAnalytics() {

    renderAnalytics();

    if (
        typeof renderDailyStreaks === "function"
    ) {
        renderDailyStreaks();
    }

}


/* =========================================
   INITIAL LOAD
========================================= */

renderAnalytics();
/* =========================================
   GLOBAL SEARCH
========================================= */

function globalSearchItems() {

    const searchInput =
        document.getElementById("globalSearch");

    if (!searchInput) {
        return;
    }

    const query =
        searchInput.value
            .trim()
            .toLowerCase();


    /* SEARCH TASKS */

    const taskCards =
        document.querySelectorAll(".task-card");

    taskCards.forEach(function(card) {

        const text =
            card.textContent.toLowerCase();

        if (
            query === "" ||
            text.includes(query)
        ) {
            card.style.display = "";
        } else {
            card.style.display = "none";
        }

    });


    /* SEARCH NOTES */

    const noteCards =
        document.querySelectorAll(".note-card");

    noteCards.forEach(function(card) {

        const text =
            card.textContent.toLowerCase();

        if (
            query === "" ||
            text.includes(query)
        ) {
            card.style.display = "";
        } else {
            card.style.display = "none";
        }

    });


    /* SEARCH SUBJECTS */

    const progressCards =
        document.querySelectorAll(".progress-card");

    progressCards.forEach(function(card) {

        const text =
            card.textContent.toLowerCase();

        if (
            query === "" ||
            text.includes(query)
        ) {
            card.style.display = "";
        } else {
            card.style.display = "none";
        }

    });

}
/* =========================================
   KEYBOARD SHORTCUTS
========================================= */

document.addEventListener("keydown", function(event) {

    /* Ctrl + K → Focus Search */

    if (
        event.ctrlKey &&
        event.key.toLowerCase() === "k"
    ) {

        event.preventDefault();

        const search =
            document.getElementById("globalSearch");

        if (search) {
            search.focus();
        }

    }


    /* Enter → Add Task */

    if (
        event.key === "Enter" &&
        document.activeElement?.id === "taskInput"
    ) {

        event.preventDefault();

        if (
            typeof addTask === "function"
        ) {
            addTask();
        }

    }


    /* Escape → Clear Search */

    if (event.key === "Escape") {

        const search =
            document.getElementById("globalSearch");

        if (search) {

            search.value = "";

            globalSearchItems();

            search.blur();

        }

    }

});
/* =========================================
   QUICK ACTION NAVIGATION
========================================= */

function scrollToFocus() {

    const section =
        document.getElementById("focus");

    if (section) {
        section.scrollIntoView({
            behavior: "smooth"
        });
    }

}


function scrollToNotes() {

    const section =
        document.getElementById("notes");

    if (section) {
        section.scrollIntoView({
            behavior: "smooth"
        });
    }

}


function scrollToProgress() {

    const section =
        document.getElementById("progress");

    if (section) {
        section.scrollIntoView({
            behavior: "smooth"
        });
    }

}
