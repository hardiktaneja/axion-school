module.exports = {
    create: [
      {
        model: "longText",
        path: "name",
        required: true,
      },
      {
        model: "longText",
        path: "address",
        required: true,
      },
    ],
  
    update: [
      {
        label: "id",
        path: "id",
        model: "id",
        required: true,
      },
      {
        model: "text",
        path: "name",
      },
      {
        label: "address",
        model: "address",
        type: "String",
      },
    ],
  
    delete: [
      {
        label: "id",
        path: "id",
        model: "id",
        type: "Number",
        required: true,
      },
    ],
  
    getByID: [
      {
        label: "id",
        path: "id",
        model: "id",
        type: "Number",
        required: true,
      },
    ],
    getAll: [],
  };