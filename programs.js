const builtInPrograms = [
  {
    id: "even-odd",
    title: "Even Odd",
    file: "Even_Odd.py",
    category: "Basics",
    icon: "binary",
    code: `num = int(input("Enter Number : "))

if num % 2 == 0:
    print("Even Number")
else:
    print("Odd Number")`,
    run(input) {
      const num = Number(input ?? prompt("Enter Number :", "12"));
      if (!Number.isFinite(num)) return "Enter Number :\nInvalid number";
      return `Enter Number : ${num}\n\n${num % 2 === 0 ? "Even Number" : "Odd Number"}`;
    }
  },
  {
    id: "largest",
    title: "Largest of Three",
    file: "Largest.py",
    category: "Basics",
    icon: "bar-chart-3",
    code: `a = int(input("Enter First Number : "))
b = int(input("Enter Second Number : "))
c = int(input("Enter Third Number : "))

if a >= b and a >= c:
    print("Largest Number :", a)
elif b >= a and b >= c:
    print("Largest Number :", b)
else:
    print("Largest Number :", c)`,
    run() {
      const raw = prompt("Enter three numbers separated by commas:", "12, 45, 18") || "";
      const nums = raw.split(/[,\s]+/).map(Number).filter(Number.isFinite);
      if (nums.length < 3) return "Please enter three valid numbers.";
      return `Numbers : ${nums.slice(0, 3).join(", ")}\n\nLargest Number : ${Math.max(...nums.slice(0, 3))}`;
    }
  },
  {
    id: "grade",
    title: "Grade Calculator",
    file: "Grade.py",
    category: "Basics",
    icon: "graduation-cap",
    code: `marks = int(input("Enter Marks : "))

if marks >= 90:
    print("Grade A")
elif marks >= 75:
    print("Grade B")
elif marks >= 60:
    print("Grade C")
elif marks >= 40:
    print("Grade D")
else:
    print("Fail")`,
    run() {
      const marks = Number(prompt("Enter Marks :", "87"));
      if (!Number.isFinite(marks)) return "Invalid marks";
      const grade = marks >= 90 ? "Grade A" : marks >= 75 ? "Grade B" : marks >= 60 ? "Grade C" : marks >= 40 ? "Grade D" : "Fail";
      return `Enter Marks : ${marks}\n\n${grade}`;
    }
  },
  {
    id: "calculator",
    title: "Calculator",
    file: "Calculator.py",
    category: "Basics",
    icon: "calculator",
    code: `a = float(input("Enter First Number : "))
b = float(input("Enter Second Number : "))
op = input("Enter Operator (+, -, *, /) : ")

if op == "+":
    print(a + b)
elif op == "-":
    print(a - b)
elif op == "*":
    print(a * b)
elif op == "/":
    print(a / b)
else:
    print("Invalid Operator")`,
    run() {
      const raw = prompt("Enter expression:", "18 * 4") || "";
      const match = raw.trim().match(/^(-?\d+(?:\.\d+)?)\s*([+\-*/])\s*(-?\d+(?:\.\d+)?)$/);
      if (!match) return "Invalid expression. Try: 18 * 4";
      const a = Number(match[1]);
      const op = match[2];
      const b = Number(match[3]);
      const result = op === "+" ? a + b : op === "-" ? a - b : op === "*" ? a * b : b === 0 ? "Cannot divide by zero" : a / b;
      return `${raw}\n\n${result}`;
    }
  },
  {
    id: "factorial",
    title: "Factorial",
    file: "Factorial.py",
    category: "Loops",
    icon: "repeat-2",
    code: `num = int(input("Enter Number : "))
fact = 1

for i in range(1, num + 1):
    fact = fact * i

print("Factorial :", fact)`,
    run() {
      const num = Math.floor(Number(prompt("Enter Number :", "5")));
      if (!Number.isFinite(num) || num < 0) return "Enter a non-negative number.";
      let fact = 1;
      for (let i = 1; i <= num; i++) fact *= i;
      return `Enter Number : ${num}\n\nFactorial : ${fact}`;
    }
  },
  {
    id: "fibonacci",
    title: "Fibonacci Series",
    file: "Fibonacci.py",
    category: "Loops",
    icon: "waves",
    code: `n = int(input("Enter Terms : "))
a = 0
b = 1

for i in range(n):
    print(a)
    c = a + b
    a = b
    b = c`,
    run() {
      const n = Math.floor(Number(prompt("Enter Terms :", "8")));
      if (!Number.isFinite(n) || n < 1) return "Enter a positive number.";
      const series = [];
      let a = 0, b = 1;
      for (let i = 0; i < n; i++) {
        series.push(a);
        [a, b] = [b, a + b];
      }
      return `Enter Terms : ${n}\n\n${series.join("\n")}`;
    }
  },
  {
    id: "sum",
    title: "Sum of Natural Numbers",
    file: "Sum.py",
    category: "Loops",
    icon: "sigma",
    code: `n = int(input("Enter Number : "))
total = 0

for i in range(1, n + 1):
    total = total + i

print("Sum :", total)`,
    run() {
      const n = Math.floor(Number(prompt("Enter Number :", "10")));
      if (!Number.isFinite(n)) return "Invalid number";
      return `Enter Number : ${n}\n\nSum : ${(n * (n + 1)) / 2}`;
    }
  },
  {
    id: "multiplication-table",
    title: "Multiplication Table",
    file: "Multiplication_Table.py",
    category: "Loops",
    icon: "table-2",
    code: `num = int(input("Enter Number : "))

for i in range(1, 11):
    print(num, "x", i, "=", num * i)`,
    run() {
      const num = Number(prompt("Enter Number :", "7"));
      if (!Number.isFinite(num)) return "Invalid number";
      return `Enter Number : ${num}\n\n` + Array.from({ length: 10 }, (_, i) => `${num} x ${i + 1} = ${num * (i + 1)}`).join("\n");
    }
  },
  {
    id: "prime",
    title: "Prime Number",
    file: "Prime_Number.py",
    category: "Number Programs",
    icon: "badge-check",
    code: `num = int(input("Enter Number : "))
flag = False

if num == 1:
    print("Not Prime Number")
elif num > 1:
    for i in range(2, num):
        if num % i == 0:
            flag = True
            break

    if flag:
        print("Not Prime Number")
    else:
        print("Prime Number")`,
    run(input) {
      const num = Math.floor(Number(input ?? prompt("Enter Number :", "13")));
      if (!Number.isFinite(num)) return "Invalid number";
      let prime = num > 1;
      for (let i = 2; i <= Math.sqrt(num); i++) if (num % i === 0) prime = false;
      return `Enter Number : ${num}\n\n${prime ? "Prime Number" : "Not Prime Number"}`;
    }
  },
  {
    id: "prime-range",
    title: "Prime Numbers in Range",
    file: "Prime_Numbers_In_Range.py",
    category: "Number Programs",
    icon: "list-ordered",
    code: `start = int(input("Enter Start : "))
end = int(input("Enter End : "))

for num in range(start, end + 1):
    if num > 1:
        for i in range(2, num):
            if num % i == 0:
                break
        else:
            print(num)`,
    run() {
      const raw = prompt("Enter range:", "1, 30") || "";
      const [start, end] = raw.split(/[,\s]+/).map(Number);
      if (!Number.isFinite(start) || !Number.isFinite(end)) return "Invalid range";
      const isPrime = n => n > 1 && Array.from({ length: Math.floor(Math.sqrt(n)) - 1 }, (_, i) => i + 2).every(d => n % d !== 0);
      const primes = [];
      for (let n = Math.min(start, end); n <= Math.max(start, end); n++) if (isPrime(n)) primes.push(n);
      return `Range : ${start} to ${end}\n\n${primes.join("\n")}`;
    }
  },
  {
    id: "prime-factors",
    title: "Prime Factors",
    file: "Prime_Factors.py",
    category: "Number Programs",
    icon: "git-branch",
    code: `num = int(input("Enter Number : "))
i = 2

while i <= num:
    if num % i == 0:
        print(i)
        num = num / i
    else:
        i = i + 1`,
    run() {
      let num = Math.floor(Number(prompt("Enter Number :", "84")));
      if (!Number.isFinite(num) || num < 2) return "Enter a number greater than 1.";
      const original = num;
      const factors = [];
      for (let i = 2; i <= num; i++) {
        while (num % i === 0) {
          factors.push(i);
          num /= i;
        }
      }
      return `Enter Number : ${original}\n\n${factors.join("\n")}`;
    }
  },
  {
    id: "armstrong",
    title: "Armstrong Number",
    file: "Armstrong.py",
    category: "Number Programs",
    icon: "sparkles",
    code: `num = int(input("Enter Number : "))
sum = 0
temp = num

while temp > 0:
    digit = temp % 10
    sum = sum + digit ** 3
    temp = temp // 10

if num == sum:
    print("Armstrong Number")
else:
    print("Not Armstrong Number")`,
    run() {
      const raw = prompt("Enter Number :", "153") || "";
      const sum = raw.split("").reduce((acc, digit) => acc + Math.pow(Number(digit), raw.length), 0);
      return `Enter Number : ${raw}\n\n${Number(raw) === sum ? "Armstrong Number" : "Not Armstrong Number"}`;
    }
  },
  {
    id: "palindrome-number",
    title: "Palindrome Number",
    file: "Palindrome.py",
    category: "Number Programs",
    icon: "scan-line",
    code: `num = int(input("Enter Number : "))
temp = num
rev = 0

while num > 0:
    digit = num % 10
    rev = rev * 10 + digit
    num = num // 10

if temp == rev:
    print("Palindrome Number")
else:
    print("Not Palindrome Number")`,
    run() {
      const raw = prompt("Enter Number :", "121") || "";
      const normalized = raw.trim();
      return `Enter Number : ${normalized}\n\n${normalized === normalized.split("").reverse().join("") ? "Palindrome Number" : "Not Palindrome Number"}`;
    }
  },
  {
    id: "reverse-number",
    title: "Reverse Number",
    file: "Reverse.py",
    category: "Number Programs",
    icon: "refresh-ccw",
    code: `num = int(input("Enter Number : "))
rev = 0

while num > 0:
    digit = num % 10
    rev = rev * 10 + digit
    num = num // 10

print("Reverse Number :", rev)`,
    run() {
      const raw = prompt("Enter Number :", "9876") || "";
      return `Enter Number : ${raw}\n\nReverse Number : ${raw.split("").reverse().join("")}`;
    }
  },
  {
    id: "factors",
    title: "Factors",
    file: "Factors.py",
    category: "Number Programs",
    icon: "divide",
    code: `num = int(input("Enter Number : "))

for i in range(1, num + 1):
    if num % i == 0:
        print(i)`,
    run() {
      const num = Math.floor(Number(prompt("Enter Number :", "24")));
      if (!Number.isFinite(num)) return "Invalid number";
      const factors = [];
      for (let i = 1; i <= Math.abs(num); i++) if (num % i === 0) factors.push(i);
      return `Enter Number : ${num}\n\n${factors.join("\n")}`;
    }
  },
  {
    id: "perfect-number",
    title: "Perfect Number",
    file: "Perfect_Number.py",
    category: "Number Programs",
    icon: "gem",
    code: `num = int(input("Enter Number : "))
sum = 0

for i in range(1, num):
    if num % i == 0:
        sum = sum + i

if sum == num:
    print("Perfect Number")
else:
    print("Not Perfect Number")`,
    run() {
      const num = Math.floor(Number(prompt("Enter Number :", "28")));
      let sum = 0;
      for (let i = 1; i < num; i++) if (num % i === 0) sum += i;
      return `Enter Number : ${num}\n\n${sum === num ? "Perfect Number" : "Not Perfect Number"}`;
    }
  },
  {
    id: "reverse-string",
    title: "Reverse String",
    file: "Reverse_String.py",
    category: "Strings",
    icon: "text-cursor-input",
    code: `text = input("Enter String : ")
reverse = text[::-1]

print("Reverse String :", reverse)`,
    run() {
      const text = prompt("Enter String :", "python") || "";
      return `Enter String : ${text}\n\nReverse String : ${text.split("").reverse().join("")}`;
    }
  },
  {
    id: "count-vowels",
    title: "Count Vowels",
    file: "Count_Vowels.py",
    category: "Strings",
    icon: "case-sensitive",
    code: `text = input("Enter String : ")
count = 0

for ch in text:
    if ch in "aeiouAEIOU":
        count = count + 1

print("Vowels :", count)`,
    run() {
      const text = prompt("Enter String :", "Python Vault") || "";
      const count = (text.match(/[aeiou]/gi) || []).length;
      return `Enter String : ${text}\n\nVowels : ${count}`;
    }
  },
  {
    id: "palindrome-string",
    title: "Palindrome String",
    file: "Palindrome_String.py",
    category: "Strings",
    icon: "align-center",
    code: `text = input("Enter String : ")

if text == text[::-1]:
    print("Palindrome String")
else:
    print("Not Palindrome String")`,
    run() {
      const text = prompt("Enter String :", "madam") || "";
      const clean = text.toLowerCase().replace(/[^a-z0-9]/g, "");
      return `Enter String : ${text}\n\n${clean === clean.split("").reverse().join("") ? "Palindrome String" : "Not Palindrome String"}`;
    }
  },
  {
    id: "star-triangle",
    title: "Star Triangle",
    file: "Star_Triangle.py",
    category: "Patterns",
    icon: "triangle",
    code: `rows = int(input("Enter Rows : "))

for i in range(1, rows + 1):
    print("*" * i)`,
    run() {
      const rows = Math.floor(Number(prompt("Enter Rows :", "5")));
      return `Enter Rows : ${rows}\n\n` + Array.from({ length: rows }, (_, i) => "*".repeat(i + 1)).join("\n");
    }
  },
  {
    id: "pyramid",
    title: "Pyramid",
    file: "Pyramid.py",
    category: "Patterns",
    icon: "mountain",
    code: `rows = int(input("Enter Rows : "))

for i in range(1, rows + 1):
    print(" " * (rows - i) + "* " * i)`,
    run() {
      const rows = Math.floor(Number(prompt("Enter Rows :", "5")));
      return `Enter Rows : ${rows}\n\n` + Array.from({ length: rows }, (_, i) => " ".repeat(rows - i - 1) + "* ".repeat(i + 1)).join("\n");
    }
  },
  {
    id: "diamond",
    title: "Diamond",
    file: "Diamond.py",
    category: "Patterns",
    icon: "diamond",
    code: `rows = int(input("Enter Rows : "))

for i in range(1, rows + 1):
    print(" " * (rows - i) + "* " * i)

for i in range(rows - 1, 0, -1):
    print(" " * (rows - i) + "* " * i)`,
    run() {
      const rows = Math.floor(Number(prompt("Enter Rows :", "5")));
      const top = Array.from({ length: rows }, (_, i) => " ".repeat(rows - i - 1) + "* ".repeat(i + 1));
      const bottom = Array.from({ length: rows - 1 }, (_, i) => " ".repeat(i + 1) + "* ".repeat(rows - i - 1));
      return `Enter Rows : ${rows}\n\n${top.concat(bottom).join("\n")}`;
    }
  },
  {
    id: "number-triangle",
    title: "Number Triangle",
    file: "Number_Triangle.py",
    category: "Patterns",
    icon: "hash",
    code: `rows = int(input("Enter Rows : "))

for i in range(1, rows + 1):
    for j in range(1, i + 1):
        print(j, end=" ")
    print()`,
    run() {
      const rows = Math.floor(Number(prompt("Enter Rows :", "5")));
      return `Enter Rows : ${rows}\n\n` + Array.from({ length: rows }, (_, i) => Array.from({ length: i + 1 }, (_, j) => j + 1).join(" ")).join("\n");
    }
  },
  {
    id: "function-prime",
    title: "Function Example",
    file: "Function_Example.py",
    category: "Functions",
    icon: "braces",
    code: `def is_prime(num):
    if num <= 1:
        return False
    for i in range(2, num):
        if num % i == 0:
            return False
    return True

num = int(input("Enter Number : "))

if is_prime(num):
    print("Prime Number")
else:
    print("Not Prime Number")`,
    run(input) {
      return builtInPrograms.find(program => program.id === "prime").run(input);
    }
  } ,
  {
    id: "box-plot",
    title: "Matplotlib Box Plot",
    file: "Graphs/Box_Plot.py",
    category: "Graphs",
    icon: "chart-box",
    code: `import matplotlib.pyplot as plt

data = [2, 6, 8, 10, 12, 14, 16, 18]
data5 = [3, 6, 9, 12, 15, 18, 21, 24]

plt.subplot(1, 2, 1)
plt.title("My Data")
plt.boxplot(data)

plt.subplot(1, 2, 2)
plt.title("Bottom Data")
plt.boxplot(data5)

plt.show()`,
    run() {
      return "Box plot created with two datasets:\\n\\nMy Data: 2, 6, 8, 10, 12, 14, 16, 18\\nBottom Data: 3, 6, 9, 12, 15, 18, 21, 24\\n\\nUses matplotlib.pyplot.boxplot().";
    }
  },
  {
    id: "simple-line-graph",
    title: "Simple Line Graph",
    file: "Graphs/Simple_Line_Graph.py",
    category: "Graphs",
    icon: "chart-line",
    code: `import matplotlib.pyplot as plt

x = ["Jan", "Feb", "March", "April", "May", "June", "July"]
print(x)

y = [20, 150, 189, 210, 240, 200, 250]
print(y)

plt.plot(x, y)
plt.title("Monthly Data")
plt.xlabel("Months")
plt.ylabel("Values")

plt.show()`,
    run() {
      return "Simple line graph data:\\n\\nJan: 20\\nFeb: 150\\nMarch: 189\\nApril: 210\\nMay: 240\\nJune: 200\\nJuly: 250\\n\\nUses matplotlib.pyplot.plot().";
    }
  },
  {
    id: "marker-line-graph",
    title: "Line Graph with Markers",
    file: "Graphs/Marker_Line_Graph.py",
    category: "Graphs",
    icon: "chart-line",
    code: `import matplotlib.pyplot as div

x = ["arya", "kotecha", "jain", "paliwal"]
print(x)

y = [12, 14, 20, 11]

div.plot(x, y,
         color="green",
         marker='+')
div.show()`,
    run() {
      return "Line graph with markers:\\n\\narya: 12\\nkotecha: 14\\njain: 20\\npaliwal: 11\\n\\nThe original program uses a green line and '+' markers.";
    }
  },
  {
    id: "student-performance-bar-chart",
    title: "Student Performance Bar Chart",
    file: "Graphs/Student_Performance_Bar_Chart.py",
    category: "Graphs",
    icon: "chart-bar",
    code: `import matplotlib.pyplot as plt
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

plt.show()`,
    run() {
      return "Student performance bar chart:\\n\\nDivyansh: Maths 85, Science 90, English 78, History 92\\nRitika: Maths 99, Science 97, English 99, History 98\\nVihan: Maths 95, Science 96, English 95, History 88\\nRidhaan: Maths 89, Science 93, English 91, History 90\\nSparsh: Maths 90, Science 93, English 85, History 98";
    }
  },
]; 
