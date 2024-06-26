#include <iostream>
#include <roingine/engine_event_queue.h>
#include <roingine/event_queue.h>
#include <roingine/roingine.h>
#include <roingine/scene.h>
#include <roingine/scene_loader.h>
#include <roingine/scene_manager.h>

int main() {
	std::cout << "Left: A; Right: D; Fly: Space; Drop: S. Goal is to get as many points as possible by eating food."
	          << std::endl;

	roingine::Engine roingine{"Gameplay Scripting", 800, 600};
	roingine::KeyboardInput::Provide(std::make_unique<roingine::SDLKeyboardInputService>());

	roingine::Scene scene{roingine::scene_loader::LoadScene("scenes/main.json")};
	roingine::SceneManager::GetInstance().SetActive(std::move(scene));
	using namespace roingine::event_queue;

	int  highScore{0};
	bool gotNewHighScore{false};

	auto listenerHandle{EventQueue::GetInstance().AttachEventHandler<EventType::ScriptEvent>([&](auto &data) {
		if (data.eventName == "scoreChanged") {
			auto const score{std::get<double>(data.data.at(0))};
			auto const scoreInt{static_cast<int>(score)};
			if (scoreInt > highScore) {
				gotNewHighScore = true;
				highScore       = scoreInt;
			}
			std::cout << "Score: " << score << std::endl;
			return;
		}

		if (data.eventName == "playerDied" && gotNewHighScore) {
			std::cout << "\n\nNEW HIGH SCORE: " << highScore << std::endl;
			gotNewHighScore = false;
		}
	})};

	roingine.Run([&]() {});
}
