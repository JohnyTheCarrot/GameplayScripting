#ifndef RIGIDBODY_H
#define RIGIDBODY_H

#include <glm/glm.hpp>
#include <roingine/components/component.h>

namespace roingine {
	class Transform;
}

namespace gs {
	class RigidBody final : public roingine::Component {
	public:
		RigidBody(roingine::GameObject &gameObject, float mass);

		void Update() override;
		void FixedUpdate() override;
		void Render() const override;

		[[nodiscard]]
		float GetMass() const noexcept;

		void SetMass(float mass);

		[[nodiscard]]
		bool GetIsAffectedByGravity() const noexcept;

		void SetIsAffectedByGravity(bool affectedByGravity) noexcept;

		[[nodiscard]]
		glm::vec2 GetSpeed() const noexcept;

		void SetSpeed(glm::vec2 speed);

	private:
		roingine::Transform &m_Transform;
		glm::vec2            m_Speed{0.f, 0.f};
		float                m_Mass;
		bool                 m_AffectedByGravity{false};
	};
}// namespace gs

#endif// RIGIDBODY_H
