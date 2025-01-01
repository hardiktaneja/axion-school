const bcrypt = require("bcrypt");
const errorResponse = require("../../../libs/errorResponse");

module.exports = class User { 

    constructor({utils, cache, config, cortex, managers, validators, mongomodels }={}){
        this.config              = config;
        this.cortex              = cortex;
        this.validators          = validators; 
        this.mongomodels         = mongomodels;
        this.tokenManager        = managers.token;
        this.usersCollection     = "users";
        // this.userExposed         = ['createUser'];
        this.httpExposed         = ['createUser','login'];
    }

    async createUser({username, password, role, school}){
        try{
            const createdUser = {username, password, role, school};

        // Data validation
        let result;

        if(role == 'SuperAdmin'){
            result = await this.validators.user.createSuperAdmin(createdUser);
        }
        else{
            result = await this.validators.user.createUser(createdUser);
        }

        if(result){
            return errorResponse.notFoundError(result[0].message)
        }
        
        // Creation Logic
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);
        createdUser.password =passwordHash
        await this.mongomodels.user.create(createdUser)

        console.log(createdUser)
        let longToken = this.tokenManager.genLongToken({userId: createdUser._id, userKey: createdUser.key });
        delete createdUser.password
        // Response
        return {
            user: createdUser, 
            longToken 
        };
        }
        catch(err){
            console.log(err)
            return errorResponse.internalServerError(err.message)
        }
        
    }

    async login({ username, password }) {
        try {
          const userFromDB = await this.mongomodels.user.findOne({ username });
          const errors = await this.validators.user.login({ username, password });

          console.log(errors)
          console.log(userFromDB)      
    
          if (errors) {
            const messages = errors.map((error) => error.message);
            return errorResponse.validationError(messages);
          }
          if (!userFromDB) {
            return errorResponse.notFoundError("username/password don't match");
          }
          const isMatchHash = await bcrypt.compare(password, userFromDB.password);
          if (!isMatchHash) {
            return errorResponse.nonAuthorizedError("username/password don't match");
          }
    
          const token = this.tokenManager.genLongToken({
            userId: userFromDB.id,
            role: userFromDB.role,
          });
        
          console.log(userFromDB.password)
          let userObject = userFromDB.toObject();
          delete userObject.password
          console.log(userFromDB)

          return { userObject, token };
        } catch (err) {
          console.error("issue in login", err);
          return errorResponse.internalServerError(err.message);
        }
      }
    


}

// {
//     username: 'hardik700',
//     'password': 'jmd',
//     'email': 'hardik700@gmail.com',
//     'role': 'abc'
// }