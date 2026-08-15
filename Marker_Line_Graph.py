import matplotlib.pyplot as div

x = ["arya", "kotecha", "jain", "paliwal"]
print(x)

y = [12, 14, 20, 11]

div.plot(x, y,
         color="green",
         marker='+')
div.show()
