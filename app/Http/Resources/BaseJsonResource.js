class BaseJsonResource {
    constructor(data) {
        this.data = data;
    }

    // This method structures a single resource response
    toJSON() {
        return this.format();
    }

    // Customize this method in the derived class to format the resource as needed
    format() {
        return this.data;
    }

    // Static method to handle a collection of resources
    static collection(dataArray) {
        return dataArray.map(item => new this(item).format());
    }
}

module.exports = BaseJsonResource;