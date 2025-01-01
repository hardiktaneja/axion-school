

module.exports = {
    createUser: [
        {
            model: "username",
            label: "username",
            path: "username",
            required: true,
        },
        {
            model: "password",
            label: "password",
            path: "password", 
            required: true,
        },
        {
            model: "text",
            label: "role",
            path: "role",
            required: true,
        },
        {
            model: "text",
            label: "school",
            path: "school",
            required: true
        }
    ],

    createSuperAdmin: [
        {
            model: "username",
            label: "username",
            path: "username",
            required: true,
        },
        {
            model: "password",
            label: "password",
            path: "password", 
            required: true,
        },
        {
            model: "text",
            label: "role",
            path: "role",
            required: true,
        },
        {
            model: "text",
            label: "school",
            path: "school"
        }
    ],

    login: [
        {
            model: "username",
            label: "username",
            path: "username",
            required: true,
        },
        {
            model: "password",
            label: "password",
            path: "password", 
            required: true,
        }
    ]
}


