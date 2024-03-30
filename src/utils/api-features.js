
export class ApiFeatures {

    constructor(query, mongooseQuery) {
        this.query = query;
        this.mongooseQuery = mongooseQuery;
    }

    pagination({ page = 1, size = 2 }) {
        if (page < 0) page = 1
        if (size < 0) size = 2

        const limit = +size
        const skip = +(page - 1) * limit

        this.mongooseQuery.limit(limit).skip(skip)

        return this
    }

    sort(sortBy) {
        if (!sortBy) {
            this.mongooseQuery = this.mongooseQuery.sort({ createdAt: 1 })
            return this
        }
        const order = sortBy.split(' ')
        const key = order[0]
        const value = order[1]
        console.log(key, value)
        this.mongooseQuery.sort({ [key]: value })

        return this
    }

    search(search) {
        const querySearch = {}

        if (search.name) querySearch.name = { $regex: search.name, $options: 'i' }


        this.mongooseQuery.find(querySearch)
        return this
    }

    filter(filter) {
        const queryFilter = JSON.stringify(filter).replace(/gte|gt|lte|lt|eq|ne|in|min/g, (operator) => `$${operator}`)
        console.log(JSON.parse(queryFilter))
        this.mongooseQuery.find(JSON.parse(queryFilter))
        return this
    }

}