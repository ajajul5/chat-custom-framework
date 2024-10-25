const ResponseCodeMixin = {
    /**
     * to get data for responseCode
     * @param int $code Response code param
     * @return object
     * @author Ajajul Ansari <ajajul.ansari@tradofina.com>
     */
    getResponseCode(code)
    {
        const responseCode = {
            /*
            |--------------------------------------------------------------------------
            | GENERAL SUCCESS RESPONSE CODE
            |--------------------------------------------------------------------------
            */
            '1' : {'request_id' : '', 'success' : true, 'response_code' : 0, 'message' : 'Success', 'http_code' : 200, 'data' : {}},

            /*
            |--------------------------------------------------------------------------
            | GENERAL ERROR RESPONSE CODE
            |--------------------------------------------------------------------------
            */
            '101' : {'request_id' : '', 'success' : false, 'response_code' : 101, 'message' : 'Validation errors', 'http_code' : 400, 'data' : {}},
            '102' : {'request_id' : '', 'success' : false, 'response_code' : 102, 'message' : 'Application errors', 'http_code' : 200, 'data' : {}},
            '103' : {'request_id' : '', 'success' : false, 'response_code' : 103, 'message' : 'x-request-id missing in header', 'http_code' : 400, 'data' : {}},
            '104' : {'request_id' : '', 'success' : false, 'response_code' : 104, 'message' : 'Record not found', 'http_code' : 404, 'data' : {}},
            '105' : {'request_id' : '', 'success' : false, 'response_code' : 105, 'message' : 'Updating restricted fields', 'http_code' : 400, 'data' : {}},
            '106' : {'request_id' : '', 'success' : false, 'response_code' : 106, 'message' : 'Record already exists.', 'http_code' : 400, 'data' : {}},

            /*
            |--------------------------------------------------------------------------
            | SERVICE SPECIFIC RESPONSE CODE
            |--------------------------------------------------------------------------
            */
            '201' : {'request_id' : '', 'success' : false, 'response_code' : 201, 'message' : '', 'http_code' : 200, 'data' : {}},
            '202' : {'request_id' : '', 'success' : false, 'response_code' : 202, 'message' : 'Invalid Login Credentials', 'http_code' : 401, 'data' : {}},
            '203' : {'request_id' : '', 'success' : false, 'response_code' : 203, 'message' : '', 'http_code' : 400, 'data' : {}},
            '204' : {'request_id' : '', 'success' : false, 'response_code' : 204, 'message' : 'URL Not Found', 'http_code' : 401, 'data' : {}},
            '205' : {'request_id' : '', 'success' : false, 'response_code' : 205, 'message' : 'Your account has been deactivated', 'http_code' : 401, 'data' : {}},
            '206' : {'request_id' : '', 'success' : false, 'response_code' : 205, 'message' : 'Partial content', 'http_code' : 206, 'data' : {}},

            /*
            |--------------------------------------------------------------------------
            | CLEINT SPECIFIC RESPONSE CODE
            |--------------------------------------------------------------------------
            */
            '401' : {'request_id' : '', 'success' : false, 'response_code' : 401, 'message' : 'Unauthorized Access', 'http_code' : 401, 'data' : {}},
            '403' : {'request_id' : '', 'success' : false, 'response_code' : 403, 'message' : 'Sorry, you do not have permission to take this action.', 'http_code' : 403, 'data' : {}},

            '500' : {'request_id' : '', 'success' : false, 'response_code' : 500, 'message' : 'Internal Server Error', 'http_code' : 500, 'data' : {}},
        }
        return responseCode[code]
    }
}

module.exports = ResponseCodeMixin