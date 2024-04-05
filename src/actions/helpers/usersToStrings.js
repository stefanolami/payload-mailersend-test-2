const usersToStrings = (users) => {
	return users
		.map((user) => [user.name, user.email])
		.map((user) => user.join(' - '))
		.join(', ')
}

export default usersToStrings
