// მომხმარებლის ანგარიშების განსაზღვრა ანგარიშის ნომრით, PIN-ით და ბალანსით
const userAccounts = [
  [123456, 1234, 1000],
  [789012, 5678, 500],
  [345678, 9012, 250],
];

// განსაზღვრეთ მაქსიმალური მცდელობები
const MAX_TOTAL_ATTEMPTS = 3;

function isNumeric(value) {
  return !isNaN(value) && isFinite(value);
}

// ფუნქცია მომხმარებლის ავთენტიფიკაციისთვის ანგარიშის ნომრისა და PIN-ის მიხედვით
function authenticateUser(accountNumber, pin) {
  for (let i = 0; i < userAccounts.length; i++) {
    if (userAccounts[i][0] === accountNumber && userAccounts[i][1] === pin) {
      return i; // დააბრუნეთ ავტორიზებული მომხმარებლის ინდექსი
    }
  }
  return -1; // დააბრუნეთ -1, თუ ავტორიზაცია ვერ მოხერხდა
}

// ფუნქცია მომხმარებლის ანგარიშის ბალანსის შესამოწმებლად
function checkBalance(accountIndex) {
  return userAccounts[accountIndex][2];
}

// მომხმარებლის ანგარიშზე თანხის ჩარიცხვის ფუნქცია
function depositMoney(accountIndex, amount) {
  if (amount >= 0) {
    userAccounts[accountIndex][2] += amount;
    return userAccounts[accountIndex][2];
  } else {
    console.log("Invalid input. Please enter a non-negative number for the deposit amount.");
    return userAccounts[accountIndex][2];
  }
}

// მომხმარებლის ანგარიშიდან თანხის ამოღების ფუნქცია
function withdrawMoney(accountIndex, amount) {
  if (amount >= 0 && userAccounts[accountIndex][2] >= amount) {
    userAccounts[accountIndex][2] -= amount;
    return userAccounts[accountIndex][2];
  } else {
    if (amount < 0) {
      console.log("Invalid input. Please enter a non-negative number for the withdrawal amount.");
    } else {
      console.log("Insufficient funds. You cannot withdraw more than your balance.");
    }
    return userAccounts[accountIndex][2];
  }
}

// ფუნქცია ბანკომატის ოპერაციების შესასრულებლად
function performATMOperations() {
  let totalAttempts = 0;
  let continueOperations = true;

  while (totalAttempts < MAX_TOTAL_ATTEMPTS && continueOperations) {
    // მომხმარებლის ანგარიშის ნომერი
    const accountNumberInput = prompt("Enter your account number:");

    // მომხმარებელმა გაუუქმა თუ არაფერი შეიტანა
    if (accountNumberInput === null || accountNumberInput.trim() === "") {
      console.log("Please enter valid information.");
      continue;
    }

    // ანგარიშის ნომერის დადასტურება
    if (!isNumeric(accountNumberInput) || accountNumberInput.length !== 6) {
      totalAttempts++;
      console.log(`Invalid input for account number. Remaining attempts: ${MAX_TOTAL_ATTEMPTS - totalAttempts}`);
      if (totalAttempts === MAX_TOTAL_ATTEMPTS) {
        console.log("You have exceeded the maximum number of attempts. Your account is blocked.");
        return;
      }
      continue;
    }

    // ანგარიშის ნომრის გადაყვანა მთელ რიცხვად
    const accountNumber = parseInt(accountNumberInput);

    // მომხმარებლის ანგარიშის ინდექსი
    const userIndex = userAccounts.findIndex(account => account[0] === accountNumber);

    // ნაპოვნია თუ არა მომხმარებლის ანგარიში
    if (userIndex !== -1) {
      const pinInput = prompt("Enter your PIN:");

      if (pinInput === null || pinInput.trim() === "") {
        console.log("Please enter valid information.");
        continue;
      }

      if (!isNumeric(pinInput) || pinInput.length !== 4) {
        totalAttempts++;
        console.log(`Invalid input for PIN. Remaining attempts: ${MAX_TOTAL_ATTEMPTS - totalAttempts}`);
        if (totalAttempts === MAX_TOTAL_ATTEMPTS) {
          console.log("You have exceeded the maximum number of attempts. Your account is blocked.");
          return;
        }
        continue;
      }

      const pin = parseInt(pinInput);

      if (userAccounts[userIndex][1] === pin) {
        console.log("Authentication successful.");

        while (continueOperations) {
          const choiceInput = prompt("Choose operation:\n1. Check Balance\n2. Deposit\n3. Withdraw\n4. Stop");

          if (!isNumeric(choiceInput)) {
            console.log("Invalid input. Please enter a valid number for the choice.");
            continue;
          }

          const choice = parseInt(choiceInput);

          switch (choice) {
            case 1:
              const balance = checkBalance(userIndex);
              const backOrStopAfterBalanceInput = prompt("Your balance: $" + balance + "\nChoose operation:\n1. Go back\n2. Stop");

              !isNumeric(backOrStopAfterBalanceInput)
                ? console.log("Invalid input. Please enter a valid number for the choice.")
                : (
                    backOrStopAfterBalanceInput === '1'
                      ? continueOperations = true
                      : backOrStopAfterBalanceInput === '2'
                        ? (continueOperations = false, console.log("Thank you for using the ATM. Have a great day!"))
                        : console.log("Invalid choice.")
                  );
              break;

            case 2:
              const depositAmountInput = prompt("Enter deposit amount:");

              if (!isNumeric(depositAmountInput)) {
                console.log("Invalid input. Please enter a valid number for the deposit amount.");
                continue;
              }

              const depositAmount = parseFloat(depositAmountInput);

              if (!isNaN(depositAmount) && depositAmount > 0) {
                console.log("New balance: $" + depositMoney(userIndex, depositAmount));
              } else {
                console.log("Invalid input. Please enter a valid positive number for the deposit amount.");
              }
              break;

            case 3:
              const withdrawAmountInput = prompt("Enter withdrawal amount:");

              if (!isNumeric(withdrawAmountInput)) {
                console.log("Invalid input. Please enter a valid number for the withdrawal amount.");
                continue;
              }
              const withdrawAmount = parseFloat(withdrawAmountInput);

              if (!isNaN(withdrawAmount) && withdrawAmount > 0) {
                const newBalance = withdrawMoney(userIndex, withdrawAmount);
                if (newBalance !== -1) {
                  console.log("New balance: $" + newBalance);
                } else {
                  console.log("Insufficient funds.");
                }
              } else {
                console.log("Invalid input. Please enter a valid positive number for the withdrawal amount.");
              }
              break;

            case 4:
              continueOperations = false;
              console.log("Thank you for using the ATM. Have a great day!");
              break;

            default:
              console.log("Invalid choice.");
          }
        }
      } else {
        // ავტორიზაცია ვერ მოხერხდა (PIN არასწორია)
        totalAttempts++;
        console.log(`Authentication failed. Incorrect PIN. Remaining attempts: ${MAX_TOTAL_ATTEMPTS - totalAttempts}`);
      }
    } else {
      // ავტორიზაცია ვერ მოხერხდა (ანგარიში ვერ მოიძებნა)
      totalAttempts++;
      console.log(`Authentication failed. Account not found. Remaining attempts: ${MAX_TOTAL_ATTEMPTS - totalAttempts}`);
    }
  }

  // მიღწეულია თუ არა მაქსიმალური მცდელობები
  if (totalAttempts === MAX_TOTAL_ATTEMPTS) {
    console.log("You have exceeded the maximum number of attempts. Your account is blocked.");
  }
}
// ბანკომატის ოპერაციების შესრულება
performATMOperations();