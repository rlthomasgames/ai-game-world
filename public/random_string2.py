import random

def random_string_generator():
    strings = ["apple", "banana", "cherry", "date", "elderberry"]
    return random.choice(strings)

if __name__ == "__main__":
    random_string = random_string_generator()
    print(random_string)