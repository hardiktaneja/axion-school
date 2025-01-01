const { label } = require("../../_common/schema.models");


module.exports = {
    sayHi: [
        {
            model: 'text',
            label: 'name',
            required: true,
        },
    ],
}


