import matplotlib.pyplot as plt

x = ["Jan", "Feb", "March", "April", "May", "June", "July"]
print(x)

y = [20, 150, 189, 210, 240, 200, 250]
print(y)

plt.plot(x, y)
plt.title("Monthly Data")
plt.xlabel("Months")
plt.ylabel("Values")

plt.show()
