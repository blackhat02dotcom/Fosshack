import random

def chatbot_response(user_input):
    responses = {
        "flights": "I can help you book flights. Where are you traveling to?",
        "hotels": "Looking for a place to stay? I can assist with hotel bookings!",
        "travel tips": "Traveling soon? I can provide some helpful travel tips!",
        "default": "I can help you find flights, hotels, and travel packages. What do you need assistance with?"
    }
    
    for key in responses:
        if key in user_input.lower():
            return responses[key]
    
    return responses["default"]


def simulate_chat():
    test_inputs = [
        "I need to book a flight to Paris",
        "Can you help me find hotels in New York?",
        "Give me some travel tips for Europe",
        "What services do you offer?",
        "exit"
    ]
    
    print("Welcome to TravelBot! How can I assist you today?")
    
    for user_input in test_inputs:
        print(f"You: {user_input}")
        if user_input.lower() in ["exit", "quit", "bye"]:
            print("TravelBot: Safe travels! Goodbye!")
            break
        
        response = chatbot_response(user_input)
        print(f"TravelBot: {response}")


if __name__ == "__main__":
    simulate_chat()
