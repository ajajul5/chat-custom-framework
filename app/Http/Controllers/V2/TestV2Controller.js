const BaseController = require('./../BaseController')
const { responseCodeMixin } = require('./../../../../config/mixins')

class TestV2Controller extends BaseController {

    index = async (req, res) => {
        let result = responseCodeMixin.getResponseCode('1')
        result.data['test'] = 'Excellent V2 Route & controller is executed.'
        return this.response(result,res)
    }
}

module.exports = new TestV2Controller()
