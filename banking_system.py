
import random

name=""
age=0
gender=""
address=""
branch=""
phone=0
email=""
aadhar=0
password=0
account_number=0
balance=0

def Create_Account():
    global name,age,gender,address,branch,phone,email,aadhar,password,account_number,balance

    name=input("ENTER THE NAME:")
    age=int(input("ENTER THE AGE:"))
    gender=input("ENTER THE GENDER:")
    address=input("ENTER THE ADDRESS:")
    branch=input("ENTER THE BRANCH:")
    phone=int(input("ENTER THE PHONE NUMBER:"))
    email=input("ENTER THE EMAIL:")
    aadhar=int(input("ENTER THE AADHAR NUMBER:"))

    otp=random.randint(1000,9999)
    print("Generated OTP:",otp)

    if otp==int(input("ENTER THE OTP:")):
        print("OTP VERIFIED SUCCESSFULLY")
    else:
        print("OTP VERIFICATION FAILED")
        return

    password=int(input("ENTER THE PASSWORD:"))
    confirm=int(input("CONFIRM PASSWORD:"))

    if password!=confirm:
        print("PASSWORD MISMATCH")
        return

    account_number=random.randint(1000000000,9999999999)
    balance=0

    print("\nACCOUNT CREATED SUCCESSFULLY")

def edit_account_details():
    global name,age,gender,address,branch,phone,email

    print("1.Name\n2.Age\n3.Gender\n4.Address\n5.Branch\n6.Phone\n7.Email")
    ch=int(input("ENTER OPTION:"))

    if ch==1:
        name=input("NEW NAME:")
    elif ch==2:
        age=int(input("NEW AGE:"))
    elif ch==3:
        gender=input("NEW GENDER:")
    elif ch==4:
        address=input("NEW ADDRESS:")
    elif ch==5:
        branch=input("NEW BRANCH:")
    elif ch==6:
        phone=int(input("NEW PHONE:"))
    elif ch==7:
        email=input("NEW EMAIL:")
    else:
        print("INVALID")
        return

    print("UPDATED SUCCESSFULLY")

def reset_password():
    global password

    current=int(input("ENTER CURRENT PASSWORD:"))

    if current==password:
        new=int(input("NEW PASSWORD:"))
        confirm=int(input("CONFIRM PASSWORD:"))

        if new==confirm:
            password=new
            print("PASSWORD UPDATED")
        else:
            print("PASSWORD MISMATCH")
    else:
        print("INCORRECT PASSWORD")

def forget_password():
    global password

    mail=input("ENTER REGISTERED EMAIL:")

    if mail!=email:
        print("EMAIL NOT MATCHED")
        return

    otp=random.randint(1000,9999)
    print("Generated OTP:",otp)

    if otp==int(input("ENTER OTP:")):
        new=int(input("NEW PASSWORD:"))
        confirm=int(input("CONFIRM PASSWORD:"))
        if new==confirm:
            password=new
            print("PASSWORD UPDATED")
        else:
            print("PASSWORD MISMATCH")
    else:
        print("INVALID OTP")

def delete_account():
    global name,age,gender,address,branch,phone,email,aadhar,password,account_number,balance
    if input("DELETE ACCOUNT (YES/NO):").upper()=="YES":
        name=""
        age=0
        gender=""
        address=""
        branch=""
        phone=0
        email=""
        aadhar=0
        password=0
        account_number=0
        balance=0
        print("ACCOUNT DELETED")

def view_account_details():
    print("\n-----ACCOUNT DETAILS-----")
    print("Name:",name)
    print("Age:",age)
    print("Gender:",gender)
    print("Address:",address)
    print("Branch:",branch)
    print("Phone:",phone)
    print("Email:",email)
    print("Aadhar:",aadhar)
    print("Account Number:",account_number)
    print("Balance:",balance)

def deposit():
    global balance
    amount=int(input("ENTER AMOUNT:"))
    balance+=amount
    print("DEPOSIT SUCCESSFUL")
    print("CURRENT BALANCE:",balance)

def withdraw():
    global balance
    amount=int(input("ENTER AMOUNT:"))
    if amount<=balance:
        balance-=amount
        print("WITHDRAW SUCCESSFUL")
        print("CURRENT BALANCE:",balance)
    else:
        print("INSUFFICIENT BALANCE")

def check_balance():
    print("CURRENT BALANCE:",balance)

def main_menu():
    print("\n1.Create Account")
    print("2.Edit Account")
    print("3.Reset Password")
    print("4.Forgot Password")
    print("5.Delete Account")
    print("6.View Account")
    print("7.Deposit")
    print("8.Withdraw")
    print("9.Check Balance")
    print("10.Exit")

while True:
    main_menu()
    op=int(input("ENTER OPTION:"))

    if op==1:
        Create_Account()
    elif op==2:
        edit_account_details()
    elif op==3:
        reset_password()
    elif op==4:
        forget_password()
    elif op==5:
        delete_account()
    elif op==6:
        view_account_details()
    elif op==7:
        deposit()
    elif op==8:
        withdraw()
    elif op==9:
        check_balance()
    elif op==10:
        print("THANK YOU")
        break
    else:
        print("INVALID OPTION")
