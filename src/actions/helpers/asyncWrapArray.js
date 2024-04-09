const asyncWrapArray = (promise) => {
	return Promise.allSettled(promise).then((results) => {
		let resultsArray = []
		results.forEach(({ value, reason }) => {
			resultsArray.push({ data: value, error: reason })
		})
		return resultsArray
	})
}

export default asyncWrapArray
