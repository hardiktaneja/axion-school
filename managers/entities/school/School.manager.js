const errorResponse = require("../../../libs/errorResponse");

class School {
    constructor({
      utils,
      errorHandlers,
      config,
      validators,
      mongomodels,} = {}) {
      this.utils = utils
      this.config = config;
      this.validators = validators;
      this.mongomodels = mongomodels;
      this.httpExposed = [
        "create",
        "put=update",
        "delete=delete",
        "get=getOne",
        "get=getAll",
      ];
      this.scopes = {
        get: ["SuperAdmin"],
        create: ["SuperAdmin"],
        update: ["SuperAdmin"],
        delete: ["SuperAdmin"],
        getAll: ["SuperAdmin"],
      };
    }

    async create({ __longToken, name, address }) {
        try {
          const { userId } = __longToken;

          const user = await this.mongomodels.user.findById(userId)
          console.log("user is this: ")
          console.log(user)
          let role = user.role
    
          //check if the user has valid class scopes
          if (!isScopeValid(this.scopes.create, role)) {
            return errorResponse.nonAuthorizedError("Insufficient permissions");
          }
          const errors = await this.validators.school.create({ name, address });
    
          if (errors) {
            const messages = errors.map((error) => error.message);
            return errorResponse.validationError(messages);
          }
    
          return this.mongomodels.school.create({ name, address });
        } catch (err) {
          console.error(err);
          return errorResponse.internalServerError(err.message);
        }
      }

    async getOne({ __longToken, res }) {
      try {
        const { userId } = __longToken;
        const id = res.req.query['id']
        const user = await this.mongomodels.user.findById(userId)
        let role = user.role
  
        //check if the user has valid class scopes
        if (!isScopeValid(this.scopes.get, role)) {
          return errorResponse.nonAuthorizedError("Insufficient permissions");
        }
        const errors = await this.validators.school.getByID({ id });
  
        if (errors) {
          const messages = errors.map((error) => error.message);
          return errorResponse.validationError(messages);
        }
        const results = await this.mongomodels.school.find().populate("classrooms");
        console.log("Schools with classrooms:", results);
      
        let respObj = await this.mongomodels.school.findOne({'_id':id}).populate("classrooms").then()
        return ( respObj || errorResponse.notFoundError(this.name) );
        // return await this.mongomodels.school.findById(id).populate("classrooms").execPopulate() || errorResponse.notFoundError(this.name);
      } catch (err) {
        console.error(err);
        return errorResponse.internalServerError(err.message);
      }
    }
  
    async getAll({ __longToken }) {
      try {
        const { userId } = __longToken;
        const user = await this.mongomodels.user.findById(userId)
        let role = user.role
  
        //check if the user has valid class scopes
        if (!isScopeValid(this.scopes.get, role)) {
          return errorResponse.nonAuthorizedError("Insufficient permissions");
        }
  
        return await this.mongomodels.school.find({}).populate("classrooms");
      } catch (err) {
        console.error(err);
        return errorResponse.internalServerError(err.message);
      }
    }
  
    async update({ __longToken, name, address }) {
      try {
        const { userId } = __longToken;
        
        const user = await this.mongomodels.user.findById(userId)
        let role = user.role
        //check if the user has valid class scopes
        if (!isScopeValid(this.scopes.update, role)) {
          return errorResponse.nonAuthorizedError("Insufficient permissions");
        }
        const errors = await this.validators.school.update({ id, name, address });
  
        if (errors) {
          const messages = errors.map((error) => error.message);
          return errorResponse.validationError(messages);
        }
  
        const school = await this.mongomodels.school.findById(id);
        if (!school) {
          return errorResponse.notFoundError(this.name);
        }
  
        return this.mongomodels.school.updateOne({ _id: id }, { $set: { name, address } });
      } catch (err) {
        console.error(err);
        return errorResponse.internalServerError(err.message);
      }
    }
  
    async delete({ __longToken }) {
      try {
        const { userId } = __longToken;
        const user = await this.mongomodels.user.findById(userId)
        let role = user.role
  
        //check if the user has valid class scopes
        if (!isScopeValid(this.scopes.delete, role)) {
          return errorResponse.nonAuthorizedError("Insufficient permissions");
        }
        const errors = await this.validators.school.delete({ id });
  
        if (errors) {
          const messages = errors.map((error) => error.message);
          return errorResponse.validationError(messages);
        }

        // First, delete the related classrooms, TODO: there is something  to check later called  #MongoDB's onDelete cascading option#
        await this.mongomodels.classroom.deleteMany({ schoolId: id });

          
        return this.mongomodels.school.findByIdAndDelete(id);

      } catch (err) {
        console.log(err);
        return errorResponse.internalServerError(err.message);
      }
    }
  }
  
  let isScopeValid = (validScopes,userRole) => {
    console.log(validScopes)
    console.log(Array.isArray(validScopes))
    console.log(validScopes.indexOf(userRole) !== -1)
    return validScopes.indexOf(userRole) !== -1
  }
  module.exports = School;