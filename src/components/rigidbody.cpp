#include "rigidbody.h"
#include <roingine/components/transform.h>
#include <roingine/game_time.h>
#include <roingine/gameobject.h>
#include <stdexcept>

using namespace roingine;

namespace gs {
	constexpr float GRAVITY{0.1};

	RigidBody::RigidBody(GameObject &gameObject, float mass)
	    : Component{gameObject}
	    , m_Transform{gameObject.GetComponent<Transform>()} {
		SetMass(mass);
	}

	void RigidBody::Update() {
	}

	void RigidBody::FixedUpdate() {
		m_Speed.y -= GRAVITY;
		m_Transform.Translate(m_Speed);
	}

	void RigidBody::Render() const {
	}

	float RigidBody::GetMass() const noexcept {
		return m_Mass;
	}

	void RigidBody::SetMass(float mass) {
		if (mass <= 0.f) {
			throw std::invalid_argument{"Mass may not be 0 or negative"};
		}

		m_Mass = mass;
	}

	bool RigidBody::GetIsAffectedByGravity() const noexcept {
		return m_AffectedByGravity;
	}

	void RigidBody::SetIsAffectedByGravity(bool affectedByGravity) noexcept {
		m_AffectedByGravity = affectedByGravity;
	}

	glm::vec2 RigidBody::GetSpeed() const noexcept {
		return m_Speed;
	}

	void RigidBody::SetSpeed(glm::vec2 speed) {
		m_Speed = speed;
	}
}// namespace gs
