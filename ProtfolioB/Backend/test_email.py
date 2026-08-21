# import smtplib

# server = smtplib.SMTP("smtp.gmail.com", 587)
# server.starttls()

# server.login(
#     "fathimahibakarumbil@gmail.com",
#     "nwyv gktd kcue hhzh"
# )

# print("Login Success")

# server.quit()





import smtplib
from email.message import EmailMessage

msg = EmailMessage()
msg["Subject"] = "Portfolio Test"
msg["From"] = "fathimahibakarumbil@gmail.com"
msg["To"] = "fathimahibakarumbil@gmail.com"

msg.set_content("This is a test email from Python.")

server = smtplib.SMTP("smtp.gmail.com", 587)
server.starttls()

server.login(
    "fathimahibakarumbil@gmail.com",
    "nwyv gktd kcue hhzh"
)

server.send_message(msg)

print("Email Sent Successfully")

server.quit()