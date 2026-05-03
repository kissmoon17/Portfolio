"""HamroGPT — a small interactive CLI assistant (Python)."""

BOT_NAME = "HamroGPT"

GREETINGS = frozenset({"hi", "hello", "hey", "yo", "sup"})
NAME_QUERIES = frozenset(
    {"whats your name", "who are you", "what is your name", "your name"}
)
GOAT_QUERIES = frozenset(
    {
        "who is the goat",
        "who is the greatest of all time",
        "who is the best",
        "who is the greatest",
        "who da goat",
    }
)
FAREWELLS = frozenset({"bye", "goodbye", "see you", "byee", "cya"})
ADD_TRIGGERS = frozenset({"+", "add", "plus"})
SUB_TRIGGERS = frozenset({"-", "subtract", "minus", "sub"})
BMI_TRIGGERS = frozenset({"calculate bmi", "bmi"})
QUIT_WORDS = frozenset({"quit", "exit", "q"})


def normalize(text: str) -> str:
    return " ".join(text.lower().strip().split())


def run() -> None:
    print(f"Hello, I am {BOT_NAME}. How can I assist you today?")
    print("(Type 'help' for commands, 'quit' to exit.)\n")

    while True:
        try:
            raw = input("You: ")
        except (EOFError, KeyboardInterrupt):
            print(f"\n{BOT_NAME}: Later, gang — stay great!")
            break

        user_input = normalize(raw)
        if not user_input:
            continue
        if user_input in QUIT_WORDS:
            print(f"{BOT_NAME}: Sheesh! Have a great day, goat!")
            break
        if user_input in {"help", "?", "commands"}:
            print(
                f"{BOT_NAME}: Try: hi, who are you, who is the goat, "
                f"add / subtract, bmi, bye, quit"
            )
            continue
        if user_input in GREETINGS:
            print(f"{BOT_NAME}: Hello gang! How can I help the goat today?")
        elif user_input in NAME_QUERIES:
            print(f"{BOT_NAME}: I am {BOT_NAME}, your friendly neighborhood GPT!")
        elif user_input in GOAT_QUERIES:
            print(
                f"{BOT_NAME}: The greatest of all time is definitely you, my GANG! "
                "You are the GOAT!"
            )
        elif user_input in FAREWELLS:
            print(f"{BOT_NAME}: Sheesh! Have a great day goat!")
        elif user_input in ADD_TRIGGERS:
            print(f"{BOT_NAME}: Sure! Please provide two numbers to add, gang.")
            try:
                num1 = float(input("First number: "))
                num2 = float(input("Second number: "))
                print(f"{BOT_NAME}: The sum is {num1 + num2}.")
            except ValueError:
                print(f"{BOT_NAME}: Oops! Gotta enter valid numbers, gangy.")
        elif user_input in SUB_TRIGGERS:
            print(f"{BOT_NAME}: Sure gangy — give me two numbers to subtract.")
            try:
                num1 = float(input("First number: "))
                num2 = float(input("Second number: "))
                print(f"{BOT_NAME}: The difference is {num1 - num2}.")
            except ValueError:
                print(f"{BOT_NAME}: Oops! Gotta enter valid numbers, gangy.")
        elif user_input in BMI_TRIGGERS:
            print(
                f"{BOT_NAME}: Enter your height in meters and weight in kg "
                "(age is optional context)."
            )
            try:
                age_s = input("Age (or press Enter to skip): ").strip()
                height = float(input("Height (meters): "))
                weight = float(input("Weight (kg): "))
                if height <= 0:
                    raise ValueError("height must be positive")
                bmi = weight / (height**2)
                if age_s:
                    age = int(age_s)
                    print(f"{BOT_NAME}: At age {age}, your BMI is {bmi:.2f}.")
                else:
                    print(f"{BOT_NAME}: Your BMI is {bmi:.2f}.")
            except ValueError:
                print(f"{BOT_NAME}: Oops! Gotta enter valid numbers, gangy.")
        else:
            print(
                f"{BOT_NAME}: I don't understand that yet — I'm still in baby phase. "
                "Try 'help' or rephrase?"
            )


if __name__ == "__main__":
    run()
