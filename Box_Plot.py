import matplotlib.pyplot as plt

data = [2, 6, 8, 10, 12, 14, 16, 18]
data5 = [3, 6, 9, 12, 15, 18, 21, 24]

plt.subplot(1, 2, 1)
plt.title("My Data")
plt.boxplot(data)

plt.subplot(1, 2, 2)
plt.title("Bottom Data")
plt.boxplot(data5)

plt.show()
