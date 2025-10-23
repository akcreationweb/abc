item1 = float(input("Enter price of item 1: "))
item2 = float(input("Enter price of item 2: "))
item3 = float(input("Enter price of item 3: "))

total_price = item1 + item2 + item3

if total_price > 1000:
    total_price -= 100  # 100 discount
    print("Discount applied: Rs.100")

print("Final total price: Rs.", total_price)
