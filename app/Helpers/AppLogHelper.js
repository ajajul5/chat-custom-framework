class AppLogHelper {
    static requestId = null  // Static property to hold the requestId
    static records = 0  // Static property to hold the requestId

    // Static method to set requestId
    static setRequestId(requestId) {
        this.requestId = requestId
    }

    // Static method to get requestId
    static getRequestId() {
        return this.requestId
    }

    /**
     * set current query executed count
     * @author Ajajul Ansari
     */
    static setTotalRecordCount(count = 0) {
        this.records = count;
    }

    /**
     * get current query executed count
     * @author Ajajul Ansari
     */
    static getTotalRecordCount() {
        return this.records;
    }
}

module.exports = AppLogHelper