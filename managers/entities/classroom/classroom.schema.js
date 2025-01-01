module.exports = {
    create: [
      {
        model: "longText",
        label: "name",
        path: "name",
        required: true,
      },
      {
        model: "longText",
        label: "schoolID",
        path: "schoolID",
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
        model: "title",
        path: "name",
      },
      {
        model: "id",
        path: "schoolID",
      },
    ],
    delete: [
      {
        label: "id",
        path: "id",
        model: "id",
        required: true,
      },
    ],
    getByID: [
      {
        label: "id",
        path: "id",
        model: "id",
        required: true,
      },
    ],
    getAll: [],
  };