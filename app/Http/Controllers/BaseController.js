const { AppLogHelper } = require("../../../config/helpers")
class BaseController {
    
    /**
     * Common responses is returning from here. 
     * @controller BaseController - Inherited class can access the response function
     * @returns {Objects}
     * @author Ajajul Ansari <ajajul.ansari@tradofina.com>
     */
    response = async (result,res) => {
        let http_code = 200
        result.request_id = AppLogHelper.getRequestId()
        if (result.hasOwnProperty('http_code')) {
            http_code = result['http_code']
            delete result['http_code']
            result.response_code = http_code
        }
        res.status(http_code).json(result)
    }
}

module.exports = BaseController