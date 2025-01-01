module.exports = class User { 

    constructor({utils, cache, config, cortex, managers, validators, mongomodels }={}){
        this.config              = config;
        this.cortex              = cortex;
        this.validators          = validators; 
        this.mongomodels         = mongomodels;
        this.tokenManager        = managers.token;
        // this.usersCollection     = "users";
        this.httpExposed         = ['get=sayHi'];
    }

    async sayHi({...props}){
        console.log("Lalalla 1")
        console.log(Object.keys(props))
        console.log(Object.keys(props))
        console.log(props.res.req.query['name'])
        console.log("Lalalla 2")
        return "pong"+props.res.req.query['name']
    }

}
