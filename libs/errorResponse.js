const errorResponse = {

    notFoundError: (model = "", message = `${model} not found`) => {
      return { ok: false, code: 404, data: {}, message, errors: [message], message: message };
    },
    
    conflictError: (model = "", message = `This ${model} already exists`) => {
      return { ok: false, code: 409, data: {}, message };
    },

    validationError: (messages) => {
      return {ok: false, code: 400, data: {}, errors: [...messages], message: "Validation Error"};
    },

    internalServerError: (message = "Internal Server Error") => {
      return { ok: false, code: 500, data: {}, message,errors:[message] };
    },    
    nonAuthorizedError: (message = "Unauthorized") => {
      return { ok: false, code: 403, data: {}, message };
    },
    
  };
  
  module.exports = errorResponse;