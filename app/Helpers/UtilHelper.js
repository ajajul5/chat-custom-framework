class UtilHelper {
    /**
     * to form 16 digits alphanumeric or numeric string eg : DRN 11789786674TD1NA6 (17 digit random number)
     * @param bool $onlyNumber To form numeric string
     * @return string
     * @author Ajajul Ansari  <ajajul.ansari@tradofina.com>
     */
    static generateString(onlyNumber = false) {
        const string = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789"
        const number = "123456789"
        // Get current timestamp in microseconds and multiply by 10000
        const timestamp = (Date.now() * 1000).toString()
        
        // Replace '0' with '8' in the timestamp
        const modifiedTimestamp = timestamp.replace(/0/g, '8')
        
        // Shuffle the string or number based on onlyNumber parameter
        const randomString = onlyNumber ? this.shuffleString(number) : this.shuffleString(string)
        
        // Combine parts of the timestamp and random string
        return this.shuffleString(modifiedTimestamp.substr(0, 3)) + 
               modifiedTimestamp.substr(5, 8) + 
               randomString.substr(0, 5)
    }

    static shuffleString(str) {
        return str.split('').sort(() => Math.random() - 0.5).join('')
    }

    /**
     * Validates required fields dynamically
     * @param body Request body
     * @param fields Array of required field name
     * @return Array
     * @author Ajajul Ansari  <ajajul.ansari@tradofina.com>
     */
    static validateFields(body, fields) {
        const missingFields = []

        fields.forEach((field) => {
            const fieldValue = UtilHelper.getNestedValue(body, field)
            if (fieldValue === undefined) {
                const errorMessage = UtilHelper.generateErrorMessage(field)
                missingFields.push({
                    field: field,
                    message: errorMessage
                })
            }
        })

        return missingFields
    }

    static getNestedValue(obj, path) {
        return path.split('.').reduce((acc, key) => {
            return acc && acc[key] !== undefined ? acc[key] : undefined
        }, obj)
    }

    static generateErrorMessage(field) {
        // Split the field by dots to handle nested fields
        const fieldParts = field.split('.')
        // For nested fields, generate a more descriptive error message
        if (fieldParts.length > 1) {
            const parentField = fieldParts[0]  // e.g., 'attributes'
            const childField = fieldParts.slice(1).join('.')  // e.g., 'display_name'

            return `${childField} is required inside ${parentField}`
        }
        // For single-level fields, return a generic message
        return `${field} is required`
    }
}

module.exports = UtilHelper