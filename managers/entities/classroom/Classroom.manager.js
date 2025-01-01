const errorResponse = require("../../../libs/errorResponse");

class Classroom {
    constructor({
      utils,
      cache,
      config,
      cortex,
      managers,
      validators,
      mongomodels,
    } = {}) {
      this.config = config;
      this.utils = utils;
      this.validators = validators;
      this.mongomodels = mongomodels;
      this.tokenManager = managers.token;
      this.httpExposed = [
        "create",
        "put=update",
        "delete=delete",
        "get=getOne",
        "get=getAll",
      ];
      this.scopes = {
        get: ["SuperAdmin", "Admin"],
        create: ["SuperAdmin", "Admin"],
        update: ["SuperAdmin", "Admin"],
        delete: ["SuperAdmin", "Admin"]
      };
    }

    async create({ __longToken, name, schoolID }) {
        try {
            const { userId } = __longToken;
            const user = await this.mongomodels.user.findById(userId)
            let role = user.role

          if (!isScopeValid(this.scopes.create, role)) {
            return errorResponse.nonAuthorizedError(
              "permission lacking"
            );
          }
          //check if this is admin then check if they have access
          if (
            role !== "SuperAdmin" &&
            !(await isAllowedAdminCreate(this.mongomodels, userId, schoolID))
          ) {
            return errorResponse.nonAuthorizedError(
              "admin and school don't match"
            );
          }
    
          const errors = await this.validators.classroom.create({ name, schoolID });
    
          if (errors) {
            const messages = errors.map((error) => error.message);
            return errorResponse.validationError(messages);
          }
    
          const existingClassroom = await this.mongomodels.classroom.findOne({
            name,
            school: schoolID,
          });
          if (existingClassroom) {
            return errorResponse.conflictError(this.name);
          }
    
          
          return await this.mongomodels.classroom.create({
            name,
            school: schoolID,
          });
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
          return errorResponse.nonAuthorizedError(
            "permission lacking"
          );
        }
  
        return await this.mongomodels.classroom.find({});
      } catch (err) {
        console.error(err);
        return errorResponse.internalServerError(err.message);
      }
    }
  
    async getOne({ __longToken, res }) {
      try {
        const { userId } = __longToken;
        const user = await this.mongomodels.user.findById(userId)
        let role = user.role

        const id = res.req.query['id']
        //check if the user has valid class scopes
        if (!isScopeValid(this.scopes.get, role)) {
          return errorResponse.nonAuthorizedError(
            "permission lacking"
          );
        }
        const errors = await this.validators.classroom.getByID({ id });
  
        if (errors) {
          const messages = errors.map((error) => error.message);
          return errorResponse.validationError(messages);
        }
  
        return (
          (await this.mongomodels.classroom.findById(id)).populate("school") ||
          errorResponse.notFoundError(this.name)
        );
      } catch (err) {
        console.error(err);
        return errorResponse.internalServerError(err.message);
      }
    }
  
    async update({ __longToken, name, res }) {
      try {
        const id = res.req.query['id']
        const { userId } = __longToken;
        const user = await this.mongomodels.user.findById(userId)
        let role = user.role
        if (
          role !== "SuperAdmin" &&
          !(await this.isAllowedAdminUpdate(this.mongomodels, userId, id))
        ) {
          return errorResponse.nonAuthorizedError(
            "admin and school don't match"
          );
        }
        //check if the user has valid class scopes
        if (!isScopeValid(this.scopes.update, role)) {
          return errorResponse.nonAuthorizedError(
            "permission lacking"
          );
        }
        const errors = await this.validators.classroom.update({ id, name });
  
        if (errors) {
          const messages = errors.map((error) => error.message);
          return errorResponse.validationError(messages);
        }
        const classroom = await this.mongomodels.classroom.findById(id);
        if (!classroom) {
          return errorResponse.notFoundError(this.name);
        }
  
        return this.mongomodels.classroom.updateOne(
          { _id: id },
          { $set: { name } }
        );
      } catch (err) {
        console.error(err);
        return errorResponse.internalServerError(err.message);
      }
    }
  
    async delete({ __longToken, params: { id } }) {
      try {
        const { userId, role } = __longToken;
        if (
          role !== "SuperAdmin" &&
          !(await this.isAllowedAdminUpdate(this.mongomodels, userId, id))
        ) {
          return errorResponse.nonAuthorizedError(
            "admin and school don't match"
          );
        }
        //check if the user has valid class scopes
        if (!isScopeValid(this.scopes.delete, role)) {
          return errorResponse.nonAuthorizedError(
            "permission lacking"
          );
        }
        const errors = await this.validators.classroom.delete({ id });
  
        if (errors) {
          const messages = errors.map((error) => error.message);
          return errorResponse.validationError(messages);
        }
  
        return this.mongomodels.classroom.findByIdAndDelete(id);
      } catch (err) {
        console.error(err);
        return errorResponse.internalServerError(err.message);
      }
    }
    isAllowedAdminUpdate = async (db, userId, id) => {
      const classroom = await db.classroom.findById(id);
      if (!classroom) {
        return errorResponse.notFoundError(this.name);
      }
      const user = await db.user.findById(userId);
      if (!user) {
        return errorResponse.notFoundError("user");
      }
      console.log(user.school)
      console.log(classroom.school)
      return user.school.toString() === classroom.school.toString();
    };
  
    isAllowedAdminCreate = async (db, userId, id) => {
      const user = await db.user.findById(userId);
      if (!user) {
        return errorResponse.notFoundError("user");
      }
      return user.school.toString() === id.toString();
    };
  }

  let isScopeValid = (validScopes,userRole) => {
    console.log(validScopes)
    console.log(Array.isArray(validScopes))
    console.log(validScopes.indexOf(userRole) !== -1)
    return validScopes.indexOf(userRole) !== -1
  }
  
  module.exports = Classroom;