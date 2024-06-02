#ifndef NON_NULL_H
#define NON_NULL_H

#include <concepts>
#include <stdexcept>
#include <type_traits>

template<typename TPtr>
concept CanDeref = requires(TPtr ptr) { *ptr; };

template<typename TPtr>
    requires(CanDeref<TPtr> and std::equality_comparable<nullptr_t>)
class NonNull final {
public:
	using Value = typename std::decay<decltype(*std::declval<TPtr>())>::type;

	NonNull(TPtr ptr)
	    : m_pPtr{std::move(ptr)} {
		if (m_pPtr == nullptr) {
			throw std::invalid_argument{"nullptr passed to NonNull"};
		}
	}

	NonNull(NonNull &&other) = default;

	~NonNull() noexcept = default;

	NonNull(nullptr_t) = delete;

	NonNull &operator=(NonNull &&other) = default;

	NonNull &operator=(TPtr &&ptr) {
		if (ptr == nullptr) {
			throw std::invalid_argument{"attempted to set NonNull to nullptr"};
		}

		m_pPtr = std::move(ptr);
	}

	NonNull &operator=(nullptr_t) = delete;

	Value const &operator*() const noexcept {
		return *m_pPtr;
	}

	Value &operator*() noexcept {
		return *m_pPtr;
	}

private:
	TPtr m_pPtr;
};

#endif// NON_NULL_H
