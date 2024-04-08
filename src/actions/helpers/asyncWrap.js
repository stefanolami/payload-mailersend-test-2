const asyncWrap = (promise) => {
	return Promise.allSettled([promise]).then(function ([{ value, reason }]) {
		return { data: value, error: reason }
	})
}

export default asyncWrap
