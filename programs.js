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
  {
    id: "vowel-frequency", title: "Vowel Frequency", file: "Vowel_Frequency.py", category: "Practice Problems", icon: "case-sensitive",
    code: `text = input("Enter a string: ")
counts = {vowel: 0 for vowel in "aeiou"}
for character in text.lower():
    if character in counts:
        counts[character] += 1
for vowel, count in counts.items():
    print(f"Frequency of vowel {vowel.upper()} =", count)
print("Total vowels present in the text =", sum(counts.values()))`,
    run(input) { const text = String(input || "Education"); const counts = Object.fromEntries([...["a","e","i","o","u"].map(v=>[v,(text.toLowerCase().match(new RegExp(v,"g"))||[]).length])]); return `Enter a string: ${text}\n\n${Object.entries(counts).map(([v,n])=>`Frequency of vowel ${v.toUpperCase()} = ${n}`).join("\n")}\nTotal vowels present in the text = ${Object.values(counts).reduce((a,b)=>a+b,0)}`; }
  },
  {
    id: "character-types", title: "Count Character Types", file: "Character_Types.py", category: "Practice Problems", icon: "scan-text",
    code: `text = input("Enter a string: ")
upper = lower = digit = special = 0
for ch in text:
    if ch.isupper(): upper += 1
    elif ch.islower(): lower += 1
    elif ch.isdigit(): digit += 1
    else: special += 1
print("Uppercase letters =", upper)
print("Lowercase letters =", lower)
print("Digits =", digit)
print("Special characters =", special)`,
    run(input) { const text=String(input||"Hello123!"); const c=[...text].reduce((a,ch)=>{if(/[A-Z]/.test(ch))a[0]++;else if(/[a-z]/.test(ch))a[1]++;else if(/[0-9]/.test(ch))a[2]++;else a[3]++;return a},[0,0,0,0]); return `Enter a string: ${text}\n\nUppercase letters = ${c[0]}\nLowercase letters = ${c[1]}\nDigits = ${c[2]}\nSpecial characters = ${c[3]}`; }
  },
  {
    id: "maximum-five", title: "Maximum of Five Numbers", file: "Maximum_of_Five.py", category: "Practice Problems", icon: "arrow-up-wide-narrow",
    code: `numbers = []
for i in range(5):
    numbers.append(int(input("Enter a number: ")))
print("Maximum number =", max(numbers))`,
    run(input) { const a=String(input||"12, 7, 35, 19, 4").split(/[\s,]+/).map(Number); if(a.length<5||a.slice(0,5).some(n=>!Number.isFinite(n)))return "Enter five numbers separated by commas."; return `Numbers: ${a.slice(0,5).join(", ")}\n\nMaximum number = ${Math.max(...a.slice(0,5))}`; }
  },
  {
    id: "armstrong-number-practice", title: "Armstrong Number Check", file: "Armstrong_Check.py", category: "Practice Problems", icon: "sparkles",
    code: `num = int(input("Enter a number: "))
digits = str(abs(num))
power = len(digits)
total = sum(int(digit) ** power for digit in digits)
print("Armstrong number" if total == num else "Not an Armstrong number")`,
    run(input) { const n=Number(String(input||"153").split(",")[0]); if(!Number.isInteger(n))return "Enter a valid integer."; const d=String(Math.abs(n)); const total=[...d].reduce((s,x)=>s+Number(x)**d.length,0); return `Enter a number: ${n}\n\n${total===n?"Armstrong number":"Not an Armstrong number"}`; }
  },
  {
    id: "first-primes", title: "First N Prime Numbers", file: "First_N_Primes.py", category: "Practice Problems", icon: "hash",
    code: `n = int(input("Enter n: "))
count = 0
number = 2
while count < n:
    if all(number % divisor for divisor in range(2, int(number ** 0.5) + 1)):
        print(number)
        count += 1
    number += 1`,
    run(input) { const n=Math.floor(Number(String(input||"10").split(",")[0])); if(!Number.isFinite(n)||n<1||n>1000)return "Enter n from 1 to 1000."; const primes=[]; for(let x=2;primes.length<n;x++){let p=true;for(let d=2;d*d<=x;d++)if(x%d===0){p=false;break;}if(p)primes.push(x);} return `Enter n: ${n}\n\n${primes.join("\n")}`; }
  },
  {
    id: "list-frequency", title: "Frequency of List Elements", file: "List_Frequency.py", category: "Practice Problems", icon: "list-ordered",
    code: `numbers = list(map(int, input("Enter numbers separated by spaces: ").split()))
for value in dict.fromkeys(numbers):
    print(value, "occurs", numbers.count(value), "times")`,
    run(input) { const a=String(input||"2, 4, 2, 5, 4, 2").split(/[\s,]+/).filter(Boolean).map(Number); if(!a.length||a.some(x=>!Number.isFinite(x)))return "Enter numbers separated by spaces or commas."; const unique=[...new Set(a)]; return `Numbers: ${a.join(", ")}\n\n${unique.map(x=>`${x} occurs ${a.filter(n=>n===x).length} times`).join("\n")}`; }
  },
  {
    id: "electricity-bill", title: "Electricity Bill Calculator", file: "Electricity_Bill.py", category: "Practice Problems", icon: "zap",
    code: `customer_no = input("Enter customer number: ")
units = int(input("Enter units consumed: "))
if units <= 100: amount = units * 5
elif units <= 300: amount = 500 + (units - 100) * 10.25
elif units <= 500: amount = 2550 + (units - 300) * 15.50
else: amount = 5650 + (units - 500) * 19.75
print("Customer Number:", customer_no)
print("Units Consumed:", units)
print("Amount to Pay: Rs.", amount)`,
    run(input) { const [customer="C-1001",unitsText="250"]=String(input||"").split(/[;,\s]+/); const u=Number(unitsText); if(!Number.isFinite(u)||u<0)return "Enter customer number and non-negative units, e.g. C-1001, 250."; const amount=u<=100?u*5:u<=300?500+(u-100)*10.25:u<=500?2550+(u-300)*15.5:5650+(u-500)*19.75; return `Customer Number: ${customer}\nUnits Consumed: ${u}\nAmount to Pay: Rs. ${amount.toFixed(2)}`; }
  },
  {
    id: "player-rating-chart", title: "Player Ratings and Statistics", file: "Player_Ratings.py", category: "Data Science", icon: "chart-column-increasing", visualization: true,
    code: `import matplotlib.pyplot as plt
import numpy as np
player_data = {"sachin": {"team": "India", "matches": 250, "runs": 18426, "average": 44.5, "rating": 95}, "virat": {"team": "India", "matches": 300, "runs": 15921, "average": 50.2, "rating": 92}, "ricky": {"team": "Australia", "matches": 200, "runs": 9005, "average": 45.0, "rating": 88}, "joe": {"team": "England", "matches": 220, "runs": 8500, "average": 42.5, "rating": 84}}
players = list(player_data)
ratings = [player_data[name]["rating"] for name in players]
print("Name  Team  Matches  Runs  Average")
for name, data in player_data.items(): print(name, data["team"], data["matches"], data["runs"], data["average"])
plt.bar(players, ratings, color="orange")
plt.title("Ratings of Players")
plt.ylim(0, 100)
plt.show()`,
    run() { return "Player rating chart and data table"; }
  },
  {
    id: "player-analysis-four-charts", title: "Player Analysis: Four Charts", file: "Player_Analysis.py", category: "Data Science", icon: "chart-no-axes-combined", visualization: true,
    code: `import matplotlib.pyplot as plt
import numpy as np
players = ["sachin", "virat", "ricky", "joe"]
matches = [250, 300, 200, 220]
runs = [18426, 15921, 9005, 8500]
average = [44.5, 50.2, 45.0, 42.5]
ratings = [95, 92, 88, 84]
for title, values in [("Matches Played", matches), ("Total Runs", runs), ("Batting Average", average), ("Player Ratings", ratings)]:
    plt.figure(figsize=(8, 5))
    plt.bar(players, values)
    plt.title(title)
    plt.grid(axis="y", linestyle="--", alpha=0.5)
    plt.show()`,
    run() { return "Four player comparison charts"; }
  },
  {
    id: "clothes-sales-boxplot", title: "Clothes Store Sales Box Plot", file: "Clothes_Sales_Boxplot.py", category: "Data Science", icon: "chart-box", visualization: true,
    code: `import matplotlib.pyplot as plt
jeans_sale = [1500, 3500, 6500, 6700, 6000, 6800]
tshirt_sale = [5400, 5500, 6500, 7000, 6600, 7300]
shirt_sale = [7500, 6000, 6800, 7300, 7200, 5500]
plt.boxplot([jeans_sale, tshirt_sale, shirt_sale], labels=["Jeans", "T-Shirts", "Shirts"])
plt.title("Clothes Store Sales")
plt.ylabel("Sales Amount")
plt.grid()
plt.show()`, run() { return "Clothes store sales box plot"; }
  },
  {
    id: "sales-line-chart", title: "Monthly Sales Line Chart", file: "Monthly_Sales.py", category: "Data Science", icon: "chart-line", visualization: true,
    code: `import matplotlib.pyplot as plt
month = ["January", "February", "March", "April", "May", "June"]
sales = [3500, 3100, 2700, 4500, 4000, 4800]
plt.plot(month, sales, label="Sales", color="red", linestyle="--", linewidth=3, marker=".")
plt.title("Sales Stats")
plt.xlabel("Month")
plt.ylabel("Sales")
plt.legend()
plt.show()`, run() { return "Monthly sales line chart"; }
  },
  {
    id: "student-marks-histogram", title: "Student Marks Histogram", file: "Student_Marks_Histogram.py", category: "Data Science", icon: "chart-no-axes-column-increasing", visualization: true,
    code: `import matplotlib.pyplot as plt
marks = [45, 67, 89, 34, 56, 78, 90, 23, 65, 88, 72, 49, 58, 91, 36, 60, 75, 82, 40, 95]
plt.hist(marks, bins=[0, 20, 40, 60, 80, 100], color="skyblue", edgecolor="black")
plt.title("Histogram of Student Marks")
plt.xlabel("Marks Range")
plt.ylabel("Number of Students")
plt.show()`, run() { return "Student marks histogram"; }
  },
  {
    id: "subplot-grid", title: "Sixteen Subplot Charts", file: "Subplot_Grid.py", category: "Data Science", icon: "layout-grid", visualization: true,
    code: `import matplotlib.pyplot as plt
x = [1, 2, 3, 4]
y = [10, 20, 15, 25]
plt.figure(figsize=(12, 10))
for i in range(1, 17):
    plt.subplot(4, 4, i)
    plt.plot(x, y)
    plt.title("Chart " + str(i))
plt.tight_layout()
plt.show()`, run() { return "Sixteen line charts arranged in a 4 × 4 grid"; }
  },
  {
    id: "image-matrix", title: "Read an Image as a Matrix", file: "Image_Matrix.py", category: "Computer Vision", icon: "scan-eye", visualization: true,
    code: `import cv2
img = cv2.imread("images/rj.jpg.jpg")
print(img)  # Image pixels are stored as a NumPy matrix (B, G, R)
cv2.imshow("Image", img)
cv2.waitKey(0)
cv2.destroyAllWindows()`, run() { return "Image loaded as a pixel matrix"; }
  },
  {
    id: "crop-image", title: "Crop an Image into Parts", file: "Crop_Image.py", category: "Computer Vision", icon: "crop", visualization: true,
    code: `import cv2
image = cv2.imread("images/rj.jpg.jpg")
top_part = image[0:200, 0:200]
middle_part = image[100:300, 150:350]
bottom_part = image[250:450, 200:400]
cv2.imshow("Original", image)
cv2.imshow("Top Part", top_part)
cv2.imshow("Middle Part", middle_part)
cv2.imshow("Bottom Part", bottom_part)
cv2.waitKey(0)
cv2.destroyAllWindows()`, run() { return "Original image and three crops"; }
  },
  {
    id: "create-color-image", title: "Create a Random Color Image", file: "Random_Color_Image.py", category: "Computer Vision", icon: "palette", visualization: true,
    code: `import numpy as np
import cv2
import random
matx = np.zeros((400, 800, 3), dtype="uint8")
for row in range(400):
    for col in range(800):
        matx[row][col] = [random.randint(0, 255) for _ in range(3)]  # B, G, R
cv2.imshow("Random Image", matx)
cv2.waitKey(0)
cv2.destroyAllWindows()`, run() { return "Random RGB image generated"; }
  },
  {
    id: "image-window-modes", title: "Image Window Sizes", file: "Image_Window_Modes.py", category: "Computer Vision", icon: "panels-top-left", visualization: true,
    code: `import cv2
img = cv2.imread("images/rj.jpg.jpg")
cv2.namedWindow("Auto-sized image", cv2.WINDOW_AUTOSIZE)
cv2.imshow("Auto-sized image", img)
cv2.namedWindow("Resizable image", cv2.WINDOW_NORMAL)
cv2.resizeWindow("Resizable image", 500, 500)
cv2.imshow("Resizable image", img)
cv2.waitKey(0)
cv2.destroyAllWindows()`, run() { return "Image shown in auto-sized and resizable windows"; }
  },
]; 

