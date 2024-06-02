#include <iostream>
#include <roingine/components/scripts.h>
#include <roingine/components/transform.h>
#include <roingine/event_queue.h>
#include <roingine/roingine.h>
#include <roingine/scene.h>
#include <roingine/scene_manager.h>
#include <roingine/script.h>

enum class EventType { FoodEaten };

template<>
struct roingine::EventTypeData<EventType, EventType::FoodEaten> final {
	struct Data_t final {};
};

using CleanShutdownData = typename roingine::EventTypeData<EventType, EventType::FoodEaten>::Data_t;

using EventQueue = roingine::EventQueue<EventType, CleanShutdownData>;

void AddMissile(roingine::Scene &scene) {
	auto  missile{scene.AddGameObject()};
	auto &missileScripts{missile.AddComponent<roingine::Scripts>()};
	missileScripts.AddScript("scripts/missile.js");
}

bool g_ShouldReset{false};
int  g_Score{0};
int  g_HighScore{0};

roingine::Script::DukValue
FoodCppCall(std::string_view name, roingine::GameObject gameObject, std::vector<roingine::Script::DukValue> &&args) {
	if (name == "foodEaten") {
		++g_Score;
		std::cout << "Score: " << g_Score << std::endl;

		if (g_Score % 10 == 0) {
			auto *pScene{roingine::SceneManager::GetInstance().GetActive()};
			AddMissile(*pScene);
		}

		auto &components{gameObject.GetScene()->GetGameObjectComponents()};
		for (auto &pair: components) {
			auto &[key, pComponent] = pair;
			auto componentHash      = key.second;
			if (componentHash != typeid(roingine::Scripts).hash_code())
				continue;

			auto scripts{dynamic_cast<roingine::Scripts *>(pComponent.get())};
			auto missile{scripts->GetScript("Missile")};
			if (!missile)
				continue;

			std::ignore = missile->CallMethod("incrementSpeed", {});
		}

		return roingine::Script::DukUndefined{};
	}

	return roingine::Script::DukUndefined{};
}

roingine::Script::DukValue PlayerCppCall(
        std::string_view name, roingine::GameObject playerObject, std::vector<roingine::Script::DukValue> &&args
) {
	if (name == "updateMissilePositions") {
		auto const worldPos{playerObject.GetComponent<roingine::Transform>().GetWorldPosition()};

		auto &components{playerObject.GetScene()->GetGameObjectComponents()};
		for (auto &pair: components) {
			auto &[key, pComponent] = pair;
			auto componentHash      = key.second;
			if (componentHash != typeid(roingine::Scripts).hash_code())
				continue;

			auto scripts{dynamic_cast<roingine::Scripts *>(pComponent.get())};
			auto missile{scripts->GetScript("Missile")};
			if (!missile)
				continue;

			std::ignore = missile->CallMethod("setTargetPos", {worldPos.x, worldPos.y});
		}

		return roingine::Script::DukUndefined{};
	}

	if (name == "die") {
		g_ShouldReset = true;
		return roingine::Script::DukUndefined{};
	}

	return roingine::Script::DukUndefined{};
};

void CreateScene() {
	roingine::Scene      scene{};
	roingine::GameObject go{scene.AddGameObject()};

	auto &scripts{go.AddComponent<roingine::Scripts>()};
	scripts.AddScript("scripts/player.js", PlayerCppCall);

	for (size_t idx{}; idx < 10; ++idx) {
		roingine::GameObject food{scene.AddGameObject()};

		auto &foodScripts{food.AddComponent<roingine::Scripts>()};
		foodScripts.AddScript("scripts/food.js", FoodCppCall);
	}

	AddMissile(scene);

	roingine::SceneManager::GetInstance().SetActive(std::move(scene));
	g_ShouldReset = false;
	g_HighScore   = std::max(g_Score, g_HighScore);
	g_Score       = 0;
	std::cout << "Current high score: " << g_HighScore << std::endl;
}

int main() {
	roingine::Engine roingine{"Gameplay Scripting", 800, 600};
	roingine::KeyboardInput::Provide(std::make_unique<roingine::SDLKeyboardInputService>());

	CreateScene();

	roingine.Run([&]() {
		EventQueue::GetInstance().Update();
		if (g_ShouldReset) {
			CreateScene();
		}
	});
}
