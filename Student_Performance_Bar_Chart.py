import matplotlib.pyplot as plt
import numpy as np

student_data = {
    "divyansh": {"maths": 85, "science": 90, "english": 78, "history": 92},
    "ritika": {"maths": 99, "science": 97, "english": 99, "history": 98},
    "vihan": {"maths": 95, "science": 96, "english": 95, "history": 88},
    "ridhaan": {"maths": 89, "science": 93, "english": 91, "history": 90},
    "sparsh": {"maths": 90, "science": 93, "english": 85, "history": 98}
}

students = list(student_data.keys())
subjects = ["maths", "science", "english", "history"]

maths_marks = [student_data[name]["maths"] for name in students]
science_marks = [student_data[name]["science"] for name in students]
english_marks = [student_data[name]["english"] for name in students]
history_marks = [student_data[name]["history"] for name in students]

x = np.arange(len(students))
width = 0.2

plt.figure(figsize=(12, 6))

plt.bar(x - 1.5 * width, maths_marks, width, label="Maths")
plt.bar(x - 0.5 * width, science_marks, width, label="Science")
plt.bar(x + 0.5 * width, english_marks, width, label="English")
plt.bar(x + 1.5 * width, history_marks, width, label="History")

plt.xlabel("Students", fontsize=12, fontweight="bold")
plt.ylabel("Marks Obtained")
plt.title("Performance of Students in 4 Subjects")

plt.xticks(x, students)
plt.ylim(0, 100)

plt.legend(title="Subject")
plt.grid(axis="y", linestyle="--", alpha=0.5)
plt.tight_layout()

plt.show()
