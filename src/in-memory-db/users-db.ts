let usersDB = [];

process.on("message", (data: any) => {
    switch (data.method) {
        case "post": {
            usersDB = data.users;
            break;
        }
        case "get": {
            process.send(usersDB);
            break;
        }
    }
});
